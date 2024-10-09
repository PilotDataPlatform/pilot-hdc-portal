/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { waitForRes } = require('../../../../utils/api');
const { contributor } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.contributorCanvas;
jest.setTimeout(700000);

describe('2.2 Canvas page – Go To', () => {
  let page;
  let api;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('perpare user is contributor', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath(
      "//tr[@data-row-key='" + contributor.username + "']",
    );
    const contributorList = await page.$x(
      "//tr[@data-row-key='" +
        contributor.username +
        "']//td[text()='Project Contributor']",
    );
    if (contributorList.length > 0) {
      const changeRoleBtn = await page.waitForXPath(
        "//tr[@data-row-key='" +
          contributor.username +
          "']//div//a[contains(text(),'role')]",
      );
      await changeRoleBtn.click();
      await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Project Contributor')]",
      );
      const contributorRoleBtn = await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Project Contributor')]",
      );
      contributorRoleBtn.click();
      await page.waitForTimeout(2000);
      await logout(page);
      await page.waitForTimeout(3000);
    }
  });
  it('In Go To, Project Contributor should be able to see Green Room icon, click it will go to corresponding file explorer page Green Room/Home ', async () => {
    await login(page, 'contributor');
    await init(page, { closeBanners: true });
    await page.waitForTimeout(4000);

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const greenHomeIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--greenhome')]",
    );

    expect(greenHomeIcon).not.toBe(null);
  });
  it('In Go To, Project Contributor should be able to see Green Room icon, click it will go to corresponding file explorer page Green Room/Home', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
    let greenHomeIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--greenhome')]",
    );

    expect(greenHomeIcon).not.toBe(null);

    //go to greenhome file expolre
    await greenHomeIcon.click();
    await page.waitForTimeout(6000);
    let greehomeTab = await page.waitForXPath(
      `//div[contains(@id, "tab-greenroom-home") and contains(@class, "ant-tabs-tab-btn")]`,
    );
    expect(greehomeTab).not.toBe(null);
  });
  it('2.2.2 In Go To, the Greenroom Files reflect all the number of files in Greenroom', async () => {
    //get data from api;
    api = `/v1/files/meta`;
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    response = await waitForRes(page, api);

    let greenhomeFiles = response;

    await page.waitForTimeout(4000);
    let pagesNum = await page.$x(
      "//li[contains(@class,'ant-pagination-item')]",
    );

    if (greenhomeFiles.total > 0) {
      expect(pagesNum.length).toBe(greenhomeFiles.num_of_pages);
    } else {
      expect(pagesNum.length).toBe(0);
    }

    await page.waitForTimeout(2000);
  });
});
