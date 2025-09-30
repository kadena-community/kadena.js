module.exports = {
  use: {
    headless: true,
    screenshot: 'on', // Take screenshots on failure or as configured
    viewport: { width: 1280, height: 720 },
  },
  outputDir: './screenshots', // Directory for screenshots
  reporter: [
    ['list'], // Console output
    ['json', { outputFile: 'test-results/report.json' }], // JSON report
  ],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
};
