module.exports = {
  mcpServers: {
    playwright: {
      url: 'http://[::1]:8931/mcp',
    },
  },
  // Other Playwright config options
  use: {
    browserName: 'chromium',
    headless: false,
  },
};
