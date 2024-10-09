/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const moment = require('moment');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.favoring;
const { searchFileByName } = require('../../../../utils/greenroomActions');
const fs = require('fs');
jest.setTimeout(700000);

const {
  generateLocalFile,
  removeExistFile,
  removeExistCollection,
  createFolder,
} = require('../../../../utils/fileScaffoldActions.js');
const {
  deleteAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');

describe('User click into favored file/folders/collection ', () => {
  let page;
  let folderName1;
  let folderName2;
  let collectionName = moment().unix().toString();
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1300, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);

    await removeExistFile(page, folderName1);
    await page.waitForTimeout(3000);
    await removeExistFile(page, folderName2);
    await page.waitForTimeout(2000);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await removeExistCollection(page, collectionName);

    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function createNewCollection(name) {
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

  it('prepare folders and favor one of it', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName1 = await createFolder(page);
    await page.waitForTimeout(3000);
    folderName2 = await createFolder(page);
    await page.waitForTimeout(3000);
  });

  it('4.2.1 Users are able to click on any file/folder/collection from Favourites, portal will re-direct user to the parent folder in which contains the clicked file/folder. ', async () => {
    await searchFileByName(page, folderName1);
    await page.waitForTimeout(2000);

    const favorBtn = await page.waitForXPath(
      "//td//span[@aria-label='star']//ancestor::button",
    );
    await favorBtn.click();
    await page.waitForTimeout(3000);

    // check the folder in favorite list
    await page.goto(`${baseUrl}landing`);
    const forderExist = await page.waitForXPath(
      `//ul[contains(@class,'Cards_mySpace-favourite')]/li/div//p[text()=${folderName1}]`,
    );
    expect(forderExist).toBeTruthy();
    await forderExist.click();
    await page.waitForTimeout(4000);

    const folderPath = await page.waitForXPath(
      `//span[@class='ant-tag' and text()='${folderName1}']`,
    );

    const parent = await page.waitForXPath(
      "//span[@class='ant-breadcrumb-link' and text()='admin']",
    );

    expect(folderPath).not.toBe(null);
    expect(parent).not.toBe(null);
  });
  it('4.2.4 Users are able to close the search tag, which will returns all file/folders within this parent folder.', async () => {
    const closeTagBtn = await page.waitForXPath(
      `//span[@class='ant-tag' and text()='${folderName1}']/span`,
    );

    await closeTagBtn.click();
    await page.waitForTimeout(5000);

    const searchTag = await page.$x(
      `//span[@class='ant-tag' and text()='${folderName1}']`,
    );

    await page.waitForXPath(`//span[text()='${folderName2}']//ancestor::tr`);

    const folder2exist = await page.$x(
      `//span[text()='${folderName2}']//ancestor::tr`,
    );

    expect(folder2exist.length).toBe(1);
    expect(searchTag.length).toBe(0);
  });
  it('prepare new collection and favor it', async () => {
    await page.waitForTimeout(3 * 1000);
    await createNewCollection(collectionName);

    const favor = await page.waitForXPath(
      `//span[@aria-label='star']//ancestor::span[text()='${collectionName}']//button`,
    );
    await favor.click();

    await page.waitForTimeout(2000);
  });
  it('4.2.2 if it is a favourite collection, portal direct user into the collection.', async () => {
    await page.goto(`${baseUrl}landing`);

    await page.waitForTimeout(3000);

    const collection = await page.$x(
      `//p[text()='${collectionName}']//ancestor::li[contains(@class,'Components_favourite__list-item--collection')]//div[@class='ant-row']`,
    );

    expect(collection.length).toBe(1);

    await collection[0].click();

    await page.waitForTimeout(3000);

    const collectionPath = await page.waitForXPath(
      `//div[ text()='Collection - ${collectionName}  ']`,
    );
    expect(collectionPath).not.toBe(null);
  });
});
