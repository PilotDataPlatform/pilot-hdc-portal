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

describe('Project Search', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('5.2.1 There should be a button on “My Projects” page that allows user to search projects ', async () => {
    await page.goto(`${baseUrl}projects`);
    const searchIcon = await page.waitForXPath(
      '//button//span[contains(@class, "anticon-search")]',
    );
    await searchIcon.click();
    const projectCodeInput = await page.waitForXPath(
      '//p[text()="Project Code"]//following-sibling::div//input',
    );
    await projectCodeInput.type(dataConfig.adminCanvas.projectCode);
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class,"LandingPageContent_secondInputLine" )]//button[@type="submit"]',
    );
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const projectList = await page.$x('//*[@class="ant-list-items"]');
    expect(projectList.length).toBe(1);
  });
});
