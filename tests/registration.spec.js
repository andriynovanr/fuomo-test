import { test, expect } from '@playwright/test';
import { RegistrationPage } from './pages/registration.page.js';

test.describe('Registrasi Akun - fuomo.id', () => {
  let regPage;

  // Buka halaman registrasi sebelum menjalankan setiap test case
  test.beforeEach(async ({ page }) => {
    regPage = new RegistrationPage(page);
    await regPage.goto();
  });

  
  // NEGATIVE CASE (dijalankan duluan agar tidak kena rate limit)

  test('Gagal registrasi - semua field kosong', async () => {
    // Langsung klik daftar tanpa isi kolom apapun
    await regPage.clickSignUp();

    // Memastikan semua error message muncul untuk setiap kolom inputan 
    await expect(regPage.nameError).toBeVisible();
    await expect(regPage.nameError).toHaveText('Kolom name wajib diisi.');

    await expect(regPage.emailError).toBeVisible();
    await expect(regPage.emailError).toHaveText('Kolom email wajib diisi.');

    await expect(regPage.genderError).toBeVisible();
    await expect(regPage.genderError).toHaveText('Kolom gender wajib diisi.');

    await expect(regPage.passwordError).toBeVisible();
    await expect(regPage.passwordError).toHaveText('Kolom password wajib diisi.');
  });

  test('Gagal registrasi - format email tidak valid', async () => {
    await regPage.fillForm({
      name: 'Email Salah Format',
      email: 'email-tanpa-at.com', // format email tanpa @ 
      gender: 'male',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    });

    await regPage.clickSignUp();

    // Pesan error khusus untuk format email yang salah
    await expect(regPage.emailError).toBeVisible();
    await expect(regPage.emailError).toHaveText(
      'Kolom email harus berupa alamat email yang valid.'
    );
  });

  test('Gagal registrasi - konfirmasi password tidak cocok', async () => {
    await regPage.fillForm({
      name: 'QA Tester',
      email: 'tester@gmail.com',
      gender: 'female',
      password: 'SecurePass123',
      confirmPassword: 'BedaPassword456', 
    });

    await regPage.clickSignUp();

    // Pesan error saat password dan konfirmasi tidak sama
    await expect(regPage.passwordError).toBeVisible();
    await expect(regPage.passwordError).toHaveText(
      'Konfirmasi password tidak cocok.'
    );
  });

  test('Gagal registrasi - password tidak memenuhi kriteria', async () => {
    // Input password dengan karakter yang terlalu pendek dan tanpa huruf besar
    await regPage.passwordInput.fill('short');

    // Indikator validasi password berubah merah karena harus minimal 8 karakter di kolom Password
    await expect(regPage.passwordLengthIndicator).toHaveClass(/text-danger/);

    // Indikator validasi password berubah merah karena harus minimal ada huruf besar di kolom Password
    await expect(regPage.passwordUppercaseIndicator).toHaveClass(/text-danger/);

    // indikator huruf kecil harus hijau karena huruf kecil sudah ada
    await expect(regPage.passwordLowercaseIndicator).toHaveClass(/text-success/);

    // Input password yang memenuhi semua kriteria untuk buktikan indikator berubah hijau semua
    await regPage.passwordInput.fill('ValidPass1');

    // 'ValidPass1' memenuhi semua syarat kriteria, indikator harus hijau
    await expect(regPage.passwordLengthIndicator).toHaveClass(/text-success/);
    await expect(regPage.passwordUppercaseIndicator).toHaveClass(/text-success/);
    await expect(regPage.passwordLowercaseIndicator).toHaveClass(/text-success/);
  });

  test('Gagal registrasi - email sudah terdaftar', async () => {
    // Input email yang sudah pernah registrasi sebelumnya
    await regPage.fillForm({
      name: 'Email Terdaftar',
      email: 'test@gmail.com', 
      gender: 'male',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    });

    await regPage.clickSignUp();

    // Pesan error karena email sudah terdaftar sebelumnya
    await expect(regPage.emailError).toBeVisible();
    await expect(regPage.emailError).toHaveText('email sudah digunakan.');
  });


  // POSITIVE CASE (dijalankan terakhir karena buat akun baru)

  test('Berhasil registrasi dengan data valid', async ({ page }) => {
    // Pakai nama & email unik agar test bisa dijalankan berulang tanpa error duplikat
    const { name, email } = RegistrationPage.generateUniqueData();

    await regPage.fillForm({
      name: name,
      email: email,
      gender: 'male',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    });

    await regPage.clickSignUp();

    // Setelah klik "Yuk Daftar", pop up pilih role muncul
    await regPage.selectRoleAndContinue();

    // Registrasi berhasil, user diarahkan ke halaman dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
