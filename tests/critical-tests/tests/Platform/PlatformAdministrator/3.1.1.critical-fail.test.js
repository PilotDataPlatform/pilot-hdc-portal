/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
jest.setTimeout(700000);

describe('Platform administrator visibility', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('3.1.1 Only platform administrator could see the administrator panel', async () => {
    const platformAdminNav = await page.waitForXPath(
      '//li[contains(@class, "ant-menu-item")]//span[contains(text(), "Platform Management")]',
    );
    expect(platformAdminNav).not.toBe(null);
    await logout(page);
    await page.waitForTimeout(3000);
    await login(page, 'collaborator');
    const platformAdminNavCollaborator = await page.$x(
      '//li[contains(@class, "ant-menu-item")]//span[contains(text(), "Platform Management")]',
    );
    expect(platformAdminNavCollaborator.length).toBe(0);
  });
});
