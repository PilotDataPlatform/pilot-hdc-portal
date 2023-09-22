/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { waitForRes } = require('../../../../utils/api');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('1.2 Canvas page – Go To', () => {
  let page;
  let api;
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

  it('1.2.1 In Go To, Project admin should be able to see Green Room, Core and Collections icons, user should be able to see the correct metadata and able to click on them to go to corresponding file explorer page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const greenHomeIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--greenhome')]",
    );
    const coreIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--core')]",
    );
    const collectionIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--collection')]",
    );
    expect(greenHomeIcon).not.toBe(null);
    expect(coreIcon).not.toBe(null);
    expect(collectionIcon).not.toBe(null);
  });
  it('1.2.1 In Go To, Project admin should be able to see Green Room, Core and Collections icons, user should be able to see the correct metadata and able to click on them to go to corresponding file explorer page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
    let greenHomeIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--greenhome')]",
    );
    let coreIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--core')]",
    );
    let collectionIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--collection')]",
    );
    expect(greenHomeIcon).not.toBe(null);
    expect(coreIcon).not.toBe(null);
    expect(collectionIcon).not.toBe(null);

    await greenHomeIcon.click();
    await page.waitForTimeout(6000);
    let greehomeTab = await page.waitForXPath(
      `//div[contains(@id, "tab-greenroom-home") and contains(@class, "ant-tabs-tab-btn")]`,
    );
    expect(greehomeTab).not.toBe(null);
  });
  it('1.2.2 In Go To, the Greenroom Files reflect all the number of files in Greenroom', async () => {
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
  it('1.2.1 from GoTo to core home in file expolre and 1.2.3 In Go To, the Core Files reflect all the number of files in Core', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
    coreIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--core')]",
    );

    api = `/v1/files/meta`;
    await coreIcon.click();
    response = await waitForRes(page, api);

    let coreFiles = response;
    await page.waitForTimeout(3000);
    let pagesNum = await page.$x(
      "//li[contains(@class,'ant-pagination-item')]",
    );
    if (coreFiles.total > 0) {
      expect(pagesNum.length).toBe(coreFiles.num_of_pages);
    } else {
      expect(pagesNum.length).toBe(0);
    }
    await page.waitForTimeout(6000);
    let coreTab = await page.waitForXPath(
      `//div[contains(@id, "tab-core-home") and contains(@class, "ant-tabs-tab-btn")]`,
    );
    expect(coreTab).not.toBe(null);
    await page.waitForTimeout(2000);
  });

  it('1.2.1 from GoTo to collection home and 1.2.4 In Go To, Colllections reflect the total number of collections the user has', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
    const opacity = await page.$x("//span[contains(@style,'opacity: 1')]");
    collectionIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--collection')]",
    );
    if (opacity.length > 0) {
      api = `/v1/files/meta`;

      await collectionIcon.click();
      response = await waitForRes(page, api);

      let collectionFiles = response;

      let pagesNum = await page.$x(
        "//li[contains(@class,'ant-pagination-item')]",
      );

      if (collectionFiles.total > 0) {
        expect(pagesNum.length).toBe(collectionFiles.num_of_pages);
      } else {
        expect(pagesNum.length).toBe(0);
      }

      let collectionTab = await page.waitForXPath(
        `//div[contains(@id, "tab-vfolder") and contains(@class, "ant-tabs-tab-btn")]`,
      );
      expect(collectionTab).not.toBe(null);
    }
  });
});
