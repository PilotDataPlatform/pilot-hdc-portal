/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { adminProjectCode } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;
  jest.setTimeout(700000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
    await init(page);
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('9.2.1 - cannot copy without selecting at least one file', async () => {
    await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_explore_actions")]',
    );

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();
    const errorPopup = await page.waitForXPath(
      '//div[contains(@class, "ant-message-notice-content")]/descendant::span[contains(text(), "Please select files to copy")]',
    );

    expect(errorPopup).toBeTruthy();
  });
});
