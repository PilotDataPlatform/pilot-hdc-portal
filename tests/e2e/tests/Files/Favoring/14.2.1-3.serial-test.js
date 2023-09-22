/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const moment = require('moment');
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  clickIntoFolder,
  removeExistFile,
  removeExistCollection,
} = require('../../../../utils/fileScaffoldActions');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.favoring;
jest.setTimeout(700000000);

describe('14.2.1-3 Favor a Collection', () => {
  let name = moment().unix().toString();
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();

    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });

  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(2000);
    await removeExistCollection(page, name);
    await page.waitForTimeout(4000);
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
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
  it('prepare new collection', async () => {
    await page.waitForTimeout(3 * 1000);
    await createNewCollection();
  });
  it("14.2.1 Any Platform user are able to favor any own collection within her Project(s)'s File Explorer. 14.2.3 The favored collection will appear in The Bridge “Favourites” card.", async () => {
    await page.waitForTimeout(2 * 1000);
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
  });
  it('perpare user is contributor', async () => {
    await logout(page);

    await login(page, 'contributor');
    await init(page, { closeBanners: true });
    await page.waitForTimeout(2000);

    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });
  it("14.2.3 Any Platform user are able to favor any own collection within her Project(s)'s File Explorer.", async () => {
    await page.waitForTimeout(3 * 1000);
    await createNewCollection();
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

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);
    const collectionNeedUnfavor = await page.waitForXPath(
      `//span[@aria-label='star']//ancestor::span[text()='${name}']//button`,
    );
    await collectionNeedUnfavor.click();
    await page.waitForTimeout(2000);

    await page.goto(`${baseUrl}landing`);
    await page.waitForTimeout(3000);
    const unfavorCollection = await page.$x(
      `//p[text()='${name}']//ancestor::li[contains(@class,'Components_favourite__list-item--collection')]`,
    );

    expect(unfavorCollection.length).toBe(0);
  });
});
