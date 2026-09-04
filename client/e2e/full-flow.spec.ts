import { test, expect } from "@playwright/test";

const uniqueEmail = `test${Date.now()}@example.com`;
const password = "password123";

test.describe("Spoonful full user flow", () => {
  test("signs up, creates, edits, deletes a recipe, and logs out", async ({ page }) => {
    // Signup
    await page.goto("/signup");
    await page.getByLabel(/username/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();

    // Should land on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Create a recipe
    await page.getByRole("button", { name: /create recipe/i }).click();
    await page.getByLabel(/title/i).fill("Playwright Test Soup");
    await page.getByLabel(/ingredients/i).fill("Water, Salt");
    await page.getByLabel(/instructions/i).fill("Boil water, add salt.");
    await page.getByLabel(/tags/i).fill("Test");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page.getByText(/successfully created/i)).toBeVisible();
    await expect(page.getByText("Playwright Test Soup")).toBeVisible();

    // Edit the recipe
    await page.getByRole("button", { name: /edit recipe/i }).click();
    const titleInput = page.getByLabel(/title/i);
    await titleInput.fill("Playwright Test Soup (Edited)");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page.getByText(/successfully updated/i)).toBeVisible();
    await expect(page.getByText("Playwright Test Soup (Edited)")).toBeVisible();

    // Delete the recipe
    await page.getByRole("button", { name: /delete recipe/i }).click();
    await page.getByRole("button", { name: /yes, delete recipe/i }).click();

    await expect(page.getByText(/successfully deleted/i)).toBeVisible();
    await expect(page.getByText("Playwright Test Soup (Edited)")).not.toBeVisible();

    // Logout
    await page.getByRole("button", { name: /profile menu/i }).click();
    await page.getByRole("button", { name: /log out/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("allows browsing recipes without logging in", async ({ page }) => {
    await page.goto("/recipes");
    await expect(page.getByRole("heading", { name: /recipe list/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search recipes/i)).toBeVisible();
  });

  test("redirects unauthenticated users away from the dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});