/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { baseUrl } = require('../../../config');

describe('Platform member should not be able to access the notification page', () => {
  jest.setTimeout(50000);
  let page;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('7.1.2 - Platform members should not see Platform management', async () => {
    await page.goto(`${baseUrl}users`);

    await page.waitForXPath(
      '//li[contains(@class, "ant-menu-item")]//a[contains(text(), "Projects")]',
      {
        visible: true,
      },
    );
    const url = page.url();
    expect(url.includes('403')).toBe(true);
  });
});
