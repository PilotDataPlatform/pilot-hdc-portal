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

describe('Platform administrator could see user profile', () => {
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

  it('3.11.1 User details contain information including User Name, Role, Email, First Name, Last Name, Join Date, Last Login Time and Status', async () => {
    await page.goto(`${baseUrl}users`);
    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row')]/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Profile')]",
    );
    await profileBtn.click();
    await page.waitForXPath(
      '//ul[contains(@class, "UserProfile_member__content")]//span[text()="Username"]//following-sibling::span',
    );
    await page.waitForTimeout(1000);

    let fields = [
      'Username',
      'First Name',
      'Last Name',
      'Join Date',
      'Email',
      'Last Login',
    ];
    let field;
    fields.forEach(async (e) => {
      field = await page.waitForXPath(
        `//ul[contains(@class, 'UserProfile_member__content')]//span[text()='${e}']//following-sibling::span`,
      );
      expect(field).not.toBe(null);
      await page.waitForTimeout(1000);
    });

    const accountStatus = await page.waitForXPath(
      "//div[@class='ant-card-extra']/span[contains(@class,'UserProfile_member__account-status--active') and text()='Account Status: ']/span",
    );
    expect(accountStatus).not.toBe(null);
  });
});
