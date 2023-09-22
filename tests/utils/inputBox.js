/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
async function clearInput(page, selector) {
  try {
    const input = await page.waitForSelector(selector);
    const value = await page.$eval(selector, (input) => input.value);
    if (value === '') {
      return;
    }
    await input.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
  } catch (err) {
    console.log(err);
  }
}

async function clearSelector(page, selector) {
  try {
    await page.click(selector);
    const tagsLength = await page.evaluate((selector) => {
      const res = document.querySelectorAll(selector + ' .ant-tag').length;
      return res;
    }, selector);
    for (let i = 0; i < tagsLength; i++) {
      await page.keyboard.press('Backspace');
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { clearInput, clearSelector };
