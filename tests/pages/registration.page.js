// Page Object untuk halaman registrasi fuomo.id
// Semua selector dan aksi terkait form registrasi dikumpulkan di sini

export class RegistrationPage {
  constructor(page) {
    this.page = page;

    // --- Form Fields ---
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.maleRadio = page.locator('#male');
    this.femaleRadio = page.locator('#female');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('input[name="password_confirmation"]');
    this.agreeCheckbox = page.locator('#agree');
    this.signUpButton = page.locator('#sign-up-button');

    // --- Error Messages ---
    this.nameError = page.locator('.name-error');
    this.emailError = page.locator('.email-error');
    this.genderError = page.locator('.gender-error');
    this.passwordError = page.locator('.password-error');

    // --- Password Validation Indicators ---
    this.passwordLengthIndicator = page.locator('#length');
    this.passwordUppercaseIndicator = page.locator('#uppercase');
    this.passwordLowercaseIndicator = page.locator('#lowercase');

    // --- Role Selection Modal ---
    this.roleModal = page.locator('#role-modal');
    this.supporterRole = page.locator('.role-item[data-value="3"]');
    this.continueButton = page.locator('#ajaxSubmit');
  }

  // Buka halaman registrasi
  async goto() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  // Isi semua field form registrasi sekaligus
  async fillForm({ name, email, gender = 'male', password, confirmPassword }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);

    if (gender === 'male') {
      await this.maleRadio.click();
    } else {
      await this.femaleRadio.click();
    }

    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.agreeCheckbox.click();
  }

  // Klik tombol "Yuk Daftar" dan tunggu respons validasi dari server
  async clickSignUp() {
    const responsePromise = this.page.waitForResponse(
      (res) => res.url().includes('validate-register'),
      { timeout: 15000 }
    );
    await this.signUpButton.click();
    await responsePromise;
  }

  // Pilih role Supporter di modal, lalu klik Continue
  async selectRoleAndContinue() {
    await this.roleModal.waitFor({ state: 'visible', timeout: 15000 });
    await this.supporterRole.click();
    await this.continueButton.click();
  }

  // Generate data unik pakai timestamp agar test bisa dijalankan berulang tanpa konflik 
  static generateUniqueData() {
    const ts = Date.now();
    return {
      name: `QA Tester ${ts}`,
      email: `qa.tester.${ts}@gmail.com`,
    };
  }
}
