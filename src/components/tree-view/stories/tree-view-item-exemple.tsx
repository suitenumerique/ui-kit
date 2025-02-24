import { TreeViewItem, TreeViewNodeProps } from ":/components/tree-view";
import { TreeViewExempleData } from "./tree-view-exemple";

import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";

import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { Button } from "@openfun/cunningham-react";

type TreeViewItemExempleProps = TreeViewNodeProps<TreeViewExempleData> & {
  loadChildren: (node: TreeViewExempleData) => Promise<TreeViewExempleData[]>;
  deleteNode: (id: string) => void;
};

export const TreeViewItemExemple = ({
  loadChildren,
  deleteNode,
  ...props
}: TreeViewItemExempleProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

  const options = [
    {
      icon: "info",
      label: "Informations",
      callback: () => alert("Informations"),
    },
    { icon: "group", label: "Partager", callback: () => alert("Partager") },
    {
      icon: "download",
      label: "Télécharger",
      callback: () => alert("Télécharger"),
      showSeparator: true,
    },
    {
      icon: "edit",
      label: "Renommer",
      callback: () => alert("Renommer"),
      isChecked: true,
      showSeparator: true,
    },
    {
      icon: "arrow_forward",
      label: "Déplacer",
      callback: () => alert("Déplacer"),
    },
    {
      icon: "arrow_back",
      label: "Dupliquer",
      callback: () => alert("Dupliquer"),
    },
    {
      icon: "add",
      isDisabled: true,
      label: "Crééer un raccourci",
      callback: () => alert("Crééer un raccourci"),
      showSeparator: true,
    },
    {
      icon: "delete",
      label: "Supprimer",
      callback: () => deleteNode(props.node.id),
      showSeparator: true,
    },
  ];

  return (
    <TreeViewItem {...props} loadChildren={(node) => loadChildren(node)}>
      <div className={"tree-view-item"}>
        <div className={`container`}>
          <span className="name">{props.node.data.name}</span>
          <div className={`actions ${isOpen ? "show-actions" : ""}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <DropdownMenu
                onOpenChange={setIsOpen}
                isOpen={isOpen}
                options={options}
              >
                <Button size="small" onClick={() => setIsOpen(!isOpen)}>
                  Open
                </Button>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </TreeViewItem>
  );
};
