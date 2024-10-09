/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { baseUrl } = require('../config');

jest.setTimeout(7000000);

describe('Verify login page has loaded correctly', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
  });

  it('Login page should load correctly with login button', async () => {
    const url = new URL(page.url());
    expect(url.pathname === '/login');

    const loginButton = await page.waitForSelector('#auth_login_btn');
    expect(loginButton).toBeTruthy();
  });
});
