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
const { projectCode } = dataConfig.userProfile;
jest.setTimeout(700000);

describe('1.4.7', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('The search result in ‘Advanced search’ should be displayed properly', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const advancedSearch = await page.waitForXPath(
      "//span[text()='Advanced Search']",
    );
    await advancedSearch.click();

    const type = await page.waitForXPath(
      "//div[contains(@class,'Modals_filterWrapper')]//span[@class='ant-select-selection-item' and text()='Upload']",
    );
    await type.click();

    const download = await page.waitForXPath(
      "//div[@class='ant-select-item-option-content' and text()='Download']",
    );
    await download.click();

    const search = await page.waitForXPath(
      "//div[contains(@class,'Modals')]//button[@type='submit']",
    );
    await search.click();
    let timelinecontent;
    try {
      timelinecontent = await page.waitForXPath(
        "//div[@class='ant-timeline-item-content']",
      );
      expect(timelinecontent).not.toBe(null);
    } catch {
      const empty = await page.waitForXPath(
        '//div[@class="ant-modal-body"]/descendant::p[contains(@class, "ant-empty-description")]',
      );
      expect(empty).not.toBe(null);
    }
  });
});
