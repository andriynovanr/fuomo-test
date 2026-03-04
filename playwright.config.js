// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Jalankan test secara berurutan agar tidak bentrok saat registrasi
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 1,
  workers: 1,

  // Reporter HTML agar bisa lihat report di browser
  reporter: 'html',

  use: {
    // URL website yang ditest
    baseURL: 'https://fuomo.id',

    // Screenshot otomatis saat test gagal 
    screenshot: 'only-on-failure',

    // Rekam trace saat retry pertama (untuk debugging)
    trace: 'on-first-retry',
  },

  // Pakai Chromium agar test lebih cepat dan stabil
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

