import { expect, test } from "@playwright/test";
import { SignupFormPage, testData } from "./helpers/test-utils";

test.describe("SignupForm - Successful Signup", () => {
  test("should successfully sign up a new user", async ({ page }) => {
    // Set up successful API response
    await page.route("**/api/register", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: testData.validUser.email,
          is_active: true,
          full_name: testData.validUser.fullName,
        }),
      });
    });

    // Initialize the signup page
    const signupPage = new SignupFormPage(page);
    await signupPage.goto();

    // Verify page loads correctly
    await expect(signupPage.heading).toBeVisible();

    // Fill out the form with valid data
    await signupPage.fillForm({
      email: testData.validUser.email,
      fullName: testData.validUser.fullName,
      password: testData.validUser.password,
    });

    // Submit the form
    await signupPage.submitForm();

    // Verify success notification appears
    await expect(page.getByText(/Account created successfully/i)).toBeVisible();

    // Verify the page redirects to home after successful signup
    await expect(page).toHaveURL("http://localhost:3000/", { timeout: 5000 });
  });
});
