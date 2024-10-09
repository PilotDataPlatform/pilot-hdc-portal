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

describe('User profile', () => {
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
  it('8.1.2 Member profile should have 3 main sections: Member Information, Project Membership and Recent Activities ', async () => {
    await page.goto(`${baseUrl}user-profile`);

    const memberInfo = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Member Profile']",
    );
    expect(memberInfo).not.toBe(null);

    const projectMembership = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Project Membership']",
    );
    expect(projectMembership).not.toBe(null);

    const recentActivities = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Recent Activities']",
    );
    expect(recentActivities).not.toBe(null);
  });
});
