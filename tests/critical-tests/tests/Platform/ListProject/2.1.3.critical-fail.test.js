/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);

describe('Project List', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('2.1.3 Click All Projects. ', async () => {
    await page.goto(`${baseUrl}projects`);
    const allProjectsIcon = await page.waitForXPath(
      '//*[@id="tab-All Projects"]',
    );
    await allProjectsIcon.click();

    const paginationItem = await page.$x(
      '//ul/li[contains(@class, "ant-pagination-item")]',
    );
    expect(paginationItem.length).toBeGreaterThan(0);

    const porjects = await page.$x(
      "//div[contains(@class,'ant-tabs-tabpane-active')]/div/div[@id='uploadercontent_project_list']/div[@class='ant-spin-nested-loading']/div[@class='ant-spin-container']/ul[@class = 'ant-list-items']/*",
    );
    expect(porjects.length).toBeGreaterThan(0);
  });
});
