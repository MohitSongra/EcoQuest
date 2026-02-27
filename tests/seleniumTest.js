const { Builder } = require("selenium-webdriver");

console.log("Selenium test started...");

(async function test() {
  let driver;
  try {
    console.log("Launching Chrome...");

    driver = await new Builder()
      .forBrowser("chrome")
      .build();   // Selenium Manager auto-handles driver

    console.log("Opening website...");
    await driver.get("https://example.com");

    console.log("Test Passed ");

  } catch (err) {
    console.log("Test Failed ");
    console.error(err);
  } finally {
    if (driver) {
      await driver.quit();
      console.log("Browser closed");
    }
  }
})();