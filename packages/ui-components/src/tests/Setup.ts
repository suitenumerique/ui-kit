import type {} from "@testing-library/jest-dom/vitest";
import * as jestDomMatchers from "@testing-library/jest-dom/matchers";
import createFetchMock from "vitest-fetch-mock";
import { expect, vi } from "vitest";
import "./AnimateMock";
import "./FileReadMethodsMock";
import "./HTMLDialogElementMock";
import "./ResizeObserverMock";

// jest-dom is hoisted to the repository root while yarn also installs vitest
// in this package's node_modules. "@testing-library/jest-dom/vitest" would
// extend the root copy of vitest, not the one running the tests, so we
// register the matchers on our own expect.
expect.extend(jestDomMatchers);

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();
