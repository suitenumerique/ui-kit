import type { Page } from "@playwright/test";

export const selectUser = async (page: Page, query: string, name: string) => {
  await page.getByRole("combobox").fill(query);
  await page.getByTestId("search-users-list").getByText(name).click();
};
