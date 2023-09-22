/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { searchFileByName } = require('../../../../utils/greenroomActions');
const {
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
  createFolder,
} = require('../../../../utils/fileScaffoldActions.js');
const { projectCode } = dataConfig.favoring;
jest.setTimeout(700000);

describe('4.1.3 My Space', () => {
  let page;
  let fileName1;
  let folderName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await removeExistFile(page, folderName);
    await page.waitForTimeout(3000);
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('prepare folder', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName = await createFolder(page);
  });
  it('If any favored file/folder is deleted, it will disappear from the Favourites list', async () => {
    await page.waitForTimeout(2000);
    await searchFileByName(page, folderName);
    await page.waitForTimeout(2000);

    const favorBtn = await page.waitForXPath(
      "//td//span[@aria-label='star']//ancestor::button",
    );
    await favorBtn.click();
    await page.waitForTimeout(3000);

    await page.goto(`${baseUrl}landing`);
    const forderExist = await page.waitForXPath(
      `//ul[contains(@class,'Cards_mySpace-favourite')]/li/div//p[text()=${folderName}]`,
    );
    expect(forderExist).toBeTruthy();

    await page.goto(`${baseUrl}project/${projectCode}/data`);

    await removeExistFile(page, folderName);

    await page.waitForTimeout(3000);

    await page.goto(`${baseUrl}landing`);

    const unfavorFolder = await page.$x(
      `//p[text()='${folderName}']//ancestor::li[contains(@class,'Components_favourite__list-item')]`,
    );

    expect(unfavorFolder.length).toBe(0);
  });
});
