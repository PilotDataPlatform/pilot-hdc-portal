/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const moment = require('moment');

const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.favoring;
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  clickIntoFolder,
  removeExistFile,
  removeExistCollection,
} = require('../../../../utils/fileScaffoldActions');
const { searchFileByName } = require('../../../../utils/greenroomActions');

jest.setTimeout(700000000);

describe('4.1.3 Users should be able to un-favor any file/folder/collections within Favourites.', () => {
  let name = moment().unix().toString();
  let folderName;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();

    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(2000);
    await removeExistFile(page, folderName);
    await page.waitForTimeout(2000);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await removeExistCollection(page, name);
    await logout(page);
    await page.waitForTimeout(3000);
  });

  async function createNewCollection() {
    const createCollection = await page.waitForXPath(
      "//span[text()='Create Collection']",
    );
    await createCollection.click();

    const userInput = await page.waitForXPath(
      "//input[@placeholder='Enter Collection Name']",
    );

    await userInput.type(name);
    const createBtn = await page.waitForXPath(
      "//span[text()='Create']//ancestor::button",
    );

    await createBtn.click();
    await page.waitForTimeout(3 * 1000);
  }
  it('prepare new collection and folder', async () => {
    await page.waitForTimeout(3 * 1000);
    await createNewCollection();
  });
  it('4.1.3 Users should be able to un-favor any collections within Favourites.', async () => {
    const favor = await page.waitForXPath(
      `//span[@aria-label='star']//ancestor::span[text()='${name}']//button`,
    );
    await favor.click();

    await page.waitForTimeout(2000);

    await page.goto(`${baseUrl}landing`);

    await page.waitForTimeout(3000);

    const collection = await page.$x(
      `//p[text()='${name}']//ancestor::li[contains(@class,'Components_favourite__list-item--collection')]`,
    );

    expect(collection.length).toBe(1);

    const editBtn = await page.waitForXPath(
      "//span[@aria-label='edit' ]//ancestor::div[@class='ant-card-extra']//button",
    );
    await editBtn.click();
    await page.waitForTimeout(2000);

    const favorUnderEdit = await page.waitForXPath(
      `//p[text()='${name}']//ancestor::li[contains(@class,'Components_favourite__list-item--collection')]//div[contains(@class,'Components_list-item__button-wrap')]//button[contains(@class,'Icons_list-item__star-button')]`,
    );
    await favorUnderEdit.click();
    await page.waitForTimeout(2000);

    const saveAction = await page.waitForXPath(
      "//span[@aria-label='save']//ancestor::button",
    );
    await saveAction.click();

    await page.waitForTimeout(3000);

    const unfavorCollection = await page.$x(
      `//p[text()='${name}']//ancestor::li[contains(@class,'Components_favourite__list-item--collection')]`,
    );

    expect(unfavorCollection.length).toBe(0);
  });

  it('prepare files', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName = await createFolder(page);
  });

  it('4.1.3 Users should be able to un-favor any file/folder within Favourites.', async () => {
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

    const editBtn = await page.waitForXPath(
      "//span[@aria-label='edit' ]//ancestor::div[@class='ant-card-extra']//button",
    );
    await editBtn.click();
    await page.waitForTimeout(2000);

    const favorUnderEdit = await page.waitForXPath(
      `//p[text()='${folderName}']//ancestor::li[contains(@class,'Components_favourite__list-item')]//div[contains(@class,'Components_list-item__button-wrap')]//button[contains(@class,'Icons_list-item__star-button')]`,
    );
    await favorUnderEdit.click();
    await page.waitForTimeout(2000);

    const saveAction = await page.waitForXPath(
      "//span[@aria-label='save']//ancestor::button",
    );
    await saveAction.click();

    await page.waitForTimeout(3000);

    const unfavorFolder = await page.$x(
      `//p[text()='${name}']//ancestor::li[contains(@class,'Components_favourite__list-item')]`,
    );

    expect(unfavorFolder.length).toBe(0);
  });
});
