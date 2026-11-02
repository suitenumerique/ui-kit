import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { auditDropdownMenu } from "../dist/dropdown-menu.js";

const root = dirname(fileURLToPath(import.meta.url));
const header = `import { Button, DropdownMenu, DropdownMenuTrigger, MenuItemBody, Tooltip, useDropdownMenu } from "@gouvfr-lasuite/ui-components";\n`;

const audit = (body, filePath = "example.tsx") =>
  auditDropdownMenu(`${header}${body}`, filePath).map(({ level, line, message }) => ({ level, line, message }));
const menuWith = (trigger) => `const menu = <DropdownMenu options={[]}>${trigger}</DropdownMenu>;\n`;

const assertSingle = (findings, level, pattern) => {
  assert.equal(findings.length, 1, JSON.stringify(findings, null, 2));
  assert.equal(findings[0].level, level);
  assert.match(findings[0].message, pattern);
};

test("accepts triggers that forward the menu button props", () => {
  for (const trigger of [
    `<Button>Actions</Button>`,
    `<Button icon={<Edit />} aria-label="Actions" />`,
    `<button type="button">{t("actions")}</button>`,
    `<a href="/more">More</a>`,
    `<div role="button" tabIndex={0}>JM</div>`,
    `<DropdownMenuTrigger aria-label="Account"><Avatar /></DropdownMenuTrigger>`,
    `<DropdownMenu.Trigger>Jeanne Martin</DropdownMenu.Trigger>`,
    `<Tooltip content="More"><Button icon={<Edit />} aria-label="More" /></Tooltip>`,
    `{isMobile ? <Button>Menu</Button> : <Button>Actions</Button>}`,
  ]) {
    assert.deepEqual(audit(menuWith(trigger)), [], trigger);
  }
});

test("reports triggers that cannot receive the menu button props", () => {
  for (const [trigger, pattern] of [
    [`<div className="avatar" onClick={toggle}><Avatar /></div>`, /`<div>`, which is neither focusable nor a button.*DropdownMenu\.Trigger/],
    [`<div className="actions"><Button>Actions</Button></div>`, /`<div>` wrapping `<Button>`: pass `<Button>` itself/],
    [`<span role="button">Actions</span>`, /`<span>` is not focusable/],
    [`<span tabIndex={0}>Actions</span>`, /`<span>` has no interactive role/],
    [`Actions`, /plain text/],
    [`<><Button>Actions</Button></>`, /fragment/],
    [`{canEdit && <Button>Actions</Button>}`, /conditional \(`&&`\)/],
    [`{canEdit ? <Button>Actions</Button> : null}`, /no trigger in this branch/],
    [`{items.map((item) => <Button key={item}>{item}</Button>)}`, /a list/],
    [`<Button>Edit</Button><Button>Delete</Button>`, /single child/],
  ]) {
    const findings = audit(menuWith(trigger));
    assertSingle(findings, "error", pattern);
    assert.equal(findings[0].line, 2);
  }
  assertSingle(audit(`const menu = <DropdownMenu options={[]} />;`), "error", /has no trigger/);
});

test("asks for a check when the trigger cannot be read statically", () => {
  assertSingle(audit(menuWith(`<MoreButton />`)), "warning", /Check once that `<MoreButton>` forwards its ref and props/);
  assertSingle(audit(menuWith(`{trigger}`)), "warning", /`trigger` cannot be checked statically/);
  assertSingle(audit(`const menu = <DropdownMenu {...props} />;`), "warning", /spread props/);
  assertSingle(audit(menuWith(`<div {...triggerProps}>JM</div>`)), "warning", /props spread on `<div>`/);
});

test("audits both sides of a trigger fallback", () => {
  assertSingle(
    audit(menuWith(`{trigger ?? <Button aria-label="More" icon={<Edit />} />}`)),
    "warning",
    /`trigger` cannot be checked statically/,
  );
  assertSingle(audit(menuWith(`{children || <Button>Actions</Button>}`)), "warning", /`children` cannot be checked/);
  assert.deepEqual(
    audit(menuWith(`{trigger ?? <span>JM</span>}`)).map(({ level }) => level),
    ["warning", "error"],
  );
});

test("warns about triggers without an accessible name", () => {
  assertSingle(audit(menuWith(`<Button icon={<Edit />} />`)), "warning", /no content and no `aria-label`/);
  assert.deepEqual(audit(menuWith(`<Button children="Actions" />`)), []);
  assert.deepEqual(audit(menuWith(`<input type="button" value="Actions" />`)), []);
  assertSingle(
    audit(menuWith(`<DropdownMenuTrigger><Avatar fullName={user.name} /></DropdownMenuTrigger>`)),
    "warning",
    /may have no accessible name/,
  );
  assert.deepEqual(audit(menuWith(`<button><img src="/me.png" alt="Account" /></button>`)), []);
});

const controlled = (trigger, extra = "") => `const actions = useDropdownMenu();
${extra}
const menu = <DropdownMenu options={[]} isOpen={actions.isOpen} onOpenChange={actions.setIsOpen}>${trigger}</DropdownMenu>;
`;

test("reports a trigger onClick that toggled the menu under a condition", () => {
  for (const [handler, extra] of [
    [`() => { if (canUpdate) { actions.setIsOpen(!actions.isOpen); } }`],
    [`() => { if (!canUpdate) return; actions.setIsOpen(true); }`],
    [`() => canUpdate && actions.setIsOpen(!actions.isOpen)`],
    [`canUpdate ? () => actions.setIsOpen(!actions.isOpen) : undefined`],
    [`handleClick`, `const handleClick = useCallback(() => { if (canUpdate) actions.setIsOpen(!actions.isOpen); }, [canUpdate]);`],
    [`toggle`, `function toggle() { if (canUpdate) { open(!actions.isOpen); } }`],
    [`() => { if (canUpdate && !actions.isOpen) actions.setIsOpen(true); }`],
  ]) {
    assertSingle(
      audit(controlled(`<Button onClick={${handler}}>Actions</Button>`, extra)),
      "error",
      /only opens the menu under a condition/,
    );
  }

  const useState = `const [open, setOpen] = useState(false);
const menu = <DropdownMenu options={[]} isOpen={open} onOpenChange={(next) => setOpen(next)}>
  <Button onClick={() => { if (canUpdate) setOpen(true); }}>Actions</Button>
</DropdownMenu>;`;
  assertSingle(audit(useState), "error", /under a condition/);
});

test("leaves unconditional toggles and unrelated conditions alone", () => {
  assert.deepEqual(audit(controlled(`<Button onClick={() => actions.setIsOpen(!actions.isOpen)}>Actions</Button>`)), []);
  assert.deepEqual(audit(controlled(`<Button onClick={() => { if (debug) log("open"); }}>Actions</Button>`)), []);

  // A condition on the open state only picks the direction of the toggle.
  assert.deepEqual(
    audit(controlled(`<Button onClick={() => (actions.isOpen ? actions.setIsOpen(false) : actions.setIsOpen(true))}>Actions</Button>`)),
    [],
  );
  assert.deepEqual(
    audit(controlled(
      `<Button onClick={actions.isOpen ? close : open}>Actions</Button>`,
      `const close = () => actions.setIsOpen(false);\nconst open = () => actions.setIsOpen(true);`,
    )),
    [],
  );

  // Text and side calls are not the open state.
  assert.deepEqual(audit(`const [open, setOpen] = useState(false);
const menu = <DropdownMenu options={[]} isOpen={open} onOpenChange={(next) => { setOpen(next); track("menu", next); }}>
  <Button onClick={() => { if (debug) console.log("menu open"); if (isMobile) track("menu-click"); }}>Actions</Button>
</DropdownMenu>;`), []);
  assertSingle(
    audit(controlled(`<Button disabled={!canUpdate} onClick={() => { if (canUpdate) actions.setIsOpen(true); }}>Actions</Button>`)),
    "warning",
    /under a condition/,
  );
});

test("resolves trigger handlers in their own scope", () => {
  const twoMenus = `const actions = useDropdownMenu();
const Guarded = () => {
  const toggle = () => { if (canUpdate) actions.setIsOpen(true); };
  return <DropdownMenu options={[]} isOpen={actions.isOpen} onOpenChange={actions.setIsOpen}><Button onClick={toggle}>A</Button></DropdownMenu>;
};
const Plain = () => {
  const toggle = () => actions.setIsOpen(!actions.isOpen);
  return <DropdownMenu options={[]} isOpen={actions.isOpen} onOpenChange={actions.setIsOpen}><Button onClick={toggle}>B</Button></DropdownMenu>;
};
`;
  const findings = audit(twoMenus);
  assertSingle(findings, "error", /under a condition/);
  assert.equal(findings[0].line, 5);
});

test("reports plain actions given a value", () => {
  const options = `const options = useMemo(() => [
  { label: "Download", value: "download", callback: download },
  ...(canPrint ? [{ label: "Print", value: "print", callback: print }] : []),
  { label: "More", children: [{ label: "Copy", value: "copy" }] },
], []);
`;
  const findings = audit(`${options}const menu = <DropdownMenu options={options}><Button>Actions</Button></DropdownMenu>;`);
  assert.deepEqual(findings.map(({ level, line }) => [level, line]), [["warning", 3], ["warning", 4], ["warning", 5]]);
  assert.match(findings[0].message, /radio item \(`menuitemradio`\)/);

  assert.deepEqual(
    audit(`${options}const menu = <DropdownMenu options={options} selectedValues={[sort]}><Button>Sort</Button></DropdownMenu>;`),
    [],
  );
});

test("reports MenuItemBody in React Aria components whose text slots have no label", () => {
  const aria = `import { Button as AriaButton, GridList, GridListItem, ListBox, ListBoxItem, Popover, Select, SelectValue, TextField } from "react-aria-components";\n`;
  assertSingle(
    audit(`${aria}const row = <GridList><GridListItem><MenuItemBody label="Report" /></GridListItem></GridList>;`),
    "error",
    /inside `<GridListItem>` needs `withSlots=\{false\}`/,
  );
  assertSingle(audit(`${aria}const field = <TextField><MenuItemBody label="Reset" withSlots /></TextField>;`), "error", /`<TextField>`/);
  assert.deepEqual(audit(`${aria}const field = <TextField><MenuItemBody label="Reset" withSlots={false} /></TextField>;`), []);
  assert.deepEqual(
    audit(`${aria}const select = <Select><Popover><ListBox><ListBoxItem><MenuItemBody label="A" /></ListBoxItem></ListBox></Popover></Select>;`),
    [],
  );
  assert.deepEqual(
    audit(`${aria}const select = <Select><AriaButton><SelectValue>{() => <MenuItemBody label="A" />}</SelectValue></AriaButton></Select>;`),
    [],
  );
  assert.deepEqual(
    auditDropdownMenu(`import { MenuItemBody, Select } from "@gouvfr-lasuite/ui-components";\nconst select = <Select><MenuItemBody label="A" /></Select>;`, "example.tsx"),
    [],
  );
});

test("follows aliases, namespaces, the former package and DropdownMenu.Root", () => {
  assertSingle(
    auditDropdownMenu(`import { DropdownMenu as Menu } from "@gouvfr-lasuite/ui-kit";\nconst menu = <Menu options={[]}><div>JM</div></Menu>;`, "example.tsx"),
    "error",
    /neither focusable/,
  );
  assertSingle(
    auditDropdownMenu(`import * as UI from "@gouvfr-lasuite/ui-components";\nconst menu = <UI.DropdownMenu options={[]}><UI.Button icon={<Edit />} /></UI.DropdownMenu>;`, "example.tsx"),
    "warning",
    /`<UI.Button>` has no content/,
  );
  assertSingle(
    audit(`const menu = <DropdownMenu.Root><div>JM</div><DropdownMenu.Popover /></DropdownMenu.Root>;`),
    "error",
    /neither focusable/,
  );
  assert.deepEqual(audit(`const menu = <DropdownMenu.Root><Button>A</Button><DropdownMenu.Popover /></DropdownMenu.Root>;`), []);
  assert.deepEqual(
    auditDropdownMenu(`import { DropdownMenu } from "radix-ui";\nconst menu = <DropdownMenu><div>JM</div></DropdownMenu>;`, "example.tsx"),
    [],
  );
});

test("parses JavaScript files", () => {
  const findings = auditDropdownMenu(
    `import { Button, DropdownMenu } from "@gouvfr-lasuite/ui-components";\nconst menu = <DropdownMenu options={[]}>{cond ? null : <Button>A</Button>}</DropdownMenu>;\n`,
    "example.jsx",
  );
  assertSingle(findings, "error", /no trigger in this branch/);

  // The JavaScript parser yields ESTree nodes (`Literal`, `Property`).
  const estree = auditDropdownMenu(
    `${header}const [open, setOpen] = useState(false);
const menu = <DropdownMenu options={[{ label: "Print", value: "print" }]} isOpen={open} onOpenChange={setOpen}>
  <Button onClick={() => { if (canPrint) setOpen(!open); }}>Actions</Button>
</DropdownMenu>;
`,
    "example.jsx",
  );
  assert.deepEqual(estree.map(({ level, line }) => [level, line]), [["warning", 3], ["error", 4]]);
});

test("reports the former menu classes in styles and scripts", () => {
  const styles = auditDropdownMenu(
    `.menu {\n  color: red;\n}\n.c__dropdown-menu-item__label-container { gap: 0; }\n.c__dropdown-menu-trigger > button {}\n.c__dropdown-menu-item__content {}\n`,
    "menu.scss",
  );
  assert.deepEqual(styles.map(({ level, line }) => [level, line]), [["warning", 4], ["warning", 5]]);
  assert.match(styles[0].message, /closest class is `c__dropdown-menu-item__content`/);
  assert.match(styles[1].message, /only `DropdownMenu.Trigger` renders it/);

  const script = auditDropdownMenu(`const subtext = row.querySelector(".c__dropdown-menu-item__label-subtext");\n`, "menu.spec.ts");
  assertSingle(script, "warning", /`c__dropdown-menu-item__description`/);
});

test("CLI reports without writing and fails only on errors", async () => {
  const directory = await mkdtemp(resolve(tmpdir(), "ui-codemod-"));
  const cli = resolve(root, "../dist/cli.js");
  const fixture = resolve(directory, "Menu.tsx");
  const input = `${header}${menuWith(`<div onClick={toggle}>JM</div>`)}`;
  await writeFile(fixture, input);

  const failing = spawnSync(process.execPath, [cli, "dropdown-menu", directory], { encoding: "utf8" });
  assert.equal(failing.status, 1);
  assert.match(failing.stdout, /^error .*Menu\.tsx:2 The trigger is a `<div>`/m);
  assert.match(failing.stdout, /1 error\(s\), 0 warning\(s\)\./);
  assert.equal(await readFile(fixture, "utf8"), input);

  await writeFile(fixture, `${header}${menuWith(`<MoreButton />`)}`);
  const passing = spawnSync(process.execPath, [cli, "dropdown-menu", directory], { encoding: "utf8" });
  assert.equal(passing.status, 0);
  assert.match(passing.stdout, /0 error\(s\), 1 warning\(s\)\./);

  const unknown = spawnSync(process.execPath, [cli, "dropdown-menu", directory, "--write"], { encoding: "utf8" });
  assert.equal(unknown.status, 2);
  assert.match(unknown.stderr, /Unknown argument: --write/);
  await rm(directory, { recursive: true, force: true });
});
