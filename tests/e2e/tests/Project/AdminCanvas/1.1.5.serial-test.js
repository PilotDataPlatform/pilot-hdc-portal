/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('1.1 Project Canvas - Top Banner ', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('1.1.5 All Project Admins should be listed in the banner with correct names in Project Members page, with hyperlink of their email address', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[@aria-label='down-circle']",
    );
    await page.waitForTimeout(6000);
    const firstName = await page.$x(
      "//td[text()='Project Administrator']//ancestor::tr//td[3]//span",
    );
    const lastName = await page.$x(
      "//td[text()='Project Administrator']//ancestor::tr//td[4]//span",
    );

    let adminListInTable = [];

    for (let i = 0; i < firstName.length; i++) {
      let fnameText = await firstName[i].evaluate((el) => el.textContent);
      let lnameText = await lastName[i].evaluate((el) => el.textContent);
      let name = fnameText + ' ' + lnameText;
      console.log(name);
      adminListInTable.push(name);
    }

    const downBtn = await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[@aria-label='down-circle']",
    );
    await downBtn.click();
    await page.waitForTimeout(2000);
    await page.waitForXPath(
      "//span[contains(@class,'Canvas_user-font') and text()='Administrators']",
    );
    const admins = await page.$x(
      "//span[contains(@class,'Canvas_user-font') and text()='Administrators']//following-sibling::a",
    );
    const adminsName = await page.$x(
      "//span[contains(@class,'Canvas_user-font') and text()='Administrators']//following-sibling::a//span",
    );
    let adminListInBanner = [];
    for (let j = 0; j < adminsName.length; j++) {
      let adminText = await adminsName[j].evaluate((el) => el.textContent);
      console.log(adminText);
      adminListInBanner.push(adminText);
    }

    expect(adminListInBanner).toEqual(adminListInTable);
    const mail = await page.$x(
      "//span[contains(@class,'Canvas_user-font') and text()='Administrators']//following-sibling::a[contains(@href,'mailto')]",
    );
    expect(admins.length).toBe(mail.length);
  });
});
