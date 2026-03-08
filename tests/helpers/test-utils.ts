import type { Page } from "@playwright/test";

/**
 * Helper class for SignupForm page interactions
 */
export class SignupFormPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto("/signup");
  }

  // Element getters
  get emailInput() {
    return this.page.getByLabel("Email");
  }

  get fullNameInput() {
    return this.page.getByLabel("Full Name");
  }

  get passwordInput() {
    return this.page.getByLabel("Password").first();
  }

  get confirmPasswordInput() {
    return this.page.getByLabel("Confirm Password");
  }

  get submitButton() {
    return this.page.getByRole("button", { name: "Create Account" });
  }

  get loginLink() {
    return this.page.getByText("Sign in here");
  }

  get heading() {
    return this.page.getByRole("heading", { name: "Create your account" });
  }

  // Actions
  async fillForm(data: {
    email: string;
    fullName?: string;
    password: string;
    confirmPassword?: string;
  }) {
    await this.emailInput.fill(data.email);

    if (data.fullName) {
      await this.fullNameInput.fill(data.fullName);
    }

    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword || data.password);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async fillAndSubmit(data: Parameters<SignupFormPage["fillForm"]>[0]) {
    await this.fillForm(data);
    await this.submitForm();
  }

  // Assertions helpers
  async expectAllFieldsVisible() {
    await this.emailInput.isVisible();
    await this.fullNameInput.isVisible();
    await this.passwordInput.isVisible();
    await this.confirmPasswordInput.isVisible();
    await this.submitButton.isVisible();
  }

  async expectFormEmpty() {
    await this.emailInput.inputValue().then((value) => value === "");
    await this.fullNameInput.inputValue().then((value) => value === "");
    await this.passwordInput.inputValue().then((value) => value === "");
    await this.confirmPasswordInput.inputValue().then((value) => value === "");
  }
}

/**
 * Common test data for signup forms
 */
export const testData = {
  validUser: {
    email: "test@example.com",
    fullName: "John Doe",
    password: "password123",
  },

  validUserMinimal: {
    email: "minimal@example.com",
    password: "pass1234",
  },

  invalidEmails: ["invalid-email", "@example.com", "test@", "test.com", ""],

  weakPasswords: ["123", "ab", "", "a"],
};

/**
 * Mock API responses for testing
 */
export const mockResponses = {
  success: (email = "test@example.com", id = 1) => ({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      id,
      email,
      is_active: true,
      full_name: "Test User",
    }),
  }),

  emailExists: {
    status: 400,
    contentType: "application/json",
    body: JSON.stringify({ message: "Email already exists" }),
  },

  validationError: {
    status: 422,
    contentType: "application/json",
    body: JSON.stringify({ message: "Validation failed" }),
  },

  serverError: {
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ message: "Internal server error" }),
  },
};

/**
 * Set up API route mocking for tests
 */
export async function setupApiMocking(page: Page) {
  // Mock successful registration by default
  await page.route("**/api/register", async (route) => {
    await route.fulfill(mockResponses.success());
  });
}

/**
 * Common test setup for signup form tests
 */
export async function setupSignupTest(page: Page) {
  const signupPage = new SignupFormPage(page);
  await signupPage.goto();
  return signupPage;
}
