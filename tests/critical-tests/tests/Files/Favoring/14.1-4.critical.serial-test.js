/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  clickIntoFolder,
  removeExistFile,
} = require('../../../../utils/fileScaffoldActions');
const { login, logout } = require('../../../../utils/login.js');
const { searchFileByName } = require('../../../../utils/greenroomActions');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000000);

const projectCodeFavoring = dataConfig.favoring.projectCode;

describe('14.1.1-4 Favor a File/Folder', () => {
  let folderName;
  let fileName1;
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

  beforeEach(async () => {
    await page.goto(`${baseUrl}landing`);
  });

  it('prepare files', async () => {
    await page.goto(`${baseUrl}project/${projectCodeFavoring}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName = await createFolder(page);
  });

  it("14.1.1 & 14.1.3 & 14.1.4 Any Platform user are able to favor or unfavor any file/folder within her Project(s)'s File Explorer", async () => {
    await page.goto(`${baseUrl}project/${projectCodeFavoring}/data`);
    await searchFileByName(page, folderName);
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

    await page.waitForTimeout(2 * 1000);
    await forderExist.click();
    await page.waitForTimeout(5 * 1000);
    const unfavorBtn = await page.waitForXPath(
      "//div[contains(@class,'FileExplorer_file-explorer')]//button[contains(@class,'Icons_star-button')]",
    );
    await unfavorBtn.click();

    await page.goto(`${baseUrl}landing`);
    await page.waitForTimeout(5 * 1000);
    const folderExistArr = await page.$x(
      `//ul[contains(@class,'Cards_mySpace-favourite')]/li/div//p[text()=${folderName}]`,
    );
    expect(folderExistArr.length).toBe(0);
  });
  it('14.1.2 Name Folder can’t be favored', async () => {
    await page.goto(`${baseUrl}project/${projectCodeFavoring}/data`);
    await page.waitForTimeout(3 * 1000);
    const root = await page.waitForXPath(
      '//span[contains(@class,"ant-breadcrumb-link") and text()="Green Room"]',
    );
    await root.click();
    await page.waitForTimeout(5 * 1000);
    const favorBtn = await page.$x("//td//button//span[@aria-label='star']");
    expect(favorBtn.length).toBe(0);
  });
});
