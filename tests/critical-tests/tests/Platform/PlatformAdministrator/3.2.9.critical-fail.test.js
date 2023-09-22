/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
jest.setTimeout(700000);

describe('Administrator console should list all users', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, {
      closeBanners: false,
    });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('3.2.9 Platform administrator will be highlighted', async () => {
    await page.goto(`${baseUrl}users`);
    const checkBox = await page.waitForXPath(
      '//span[contains(text(),"Platform Administrator Only")]/ancestor::label//span[contains(@class, "ant-checkbox")]',
    );
    await checkBox.click();
    await page.waitForTimeout(3000);
    const adminRowStars = await page.$x(
      '//table//tbody//tr[contains(@class, "ant-table-row")]//td//span[contains(@class, "anticon-crown")]',
    );
    expect(adminRowStars.length).toBeGreaterThan(0);
  });
});
