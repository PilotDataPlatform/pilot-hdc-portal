/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);
const { projectCode } = dataConfig.adminCanvas;

const {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  copyExistFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');
const {
  deleteAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');

describe('Newsfeed ', () => {
  let fileName1;
  let fileName2;
  let folderName;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('upload file in namefolder', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName = await createFolder(page);
    await clickIntoFolder(page, folderName);

    fileName1 = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName1) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName1);
    }
  });
  it('perpare for deleted/copy or excute data in my namefolder', async () => {
    await copyExistFile(page, 'admin', fileName1, 'Core');
    fileName2 = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'tinified.zip',
    );
    if (fileName2) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName2);
    }

    await page.waitForTimeout(3000);

    await removeLocalFile(fileName1);
    await removeLocalFile(fileName2);
    await removeExistFile(page, fileName2);
    await page.waitForTimeout(2000);
  }),
    it('4.3 1)Notification should display pipeline status 2) Notification should be able to extand and shows more details, ie, source and destination 3)The message receive priority will be Initiator > owner > receiver. Which means that if a user is both initiator and the owner, he/she should receive message only as the initiator', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/landing`);
      await page.waitForTimeout(3000);
      let pipeline1 = await page.waitForXPath(
        `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]`,
      );
      if (pipeline1) {
        let status1 = await page.waitForXPath(
          `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]/ancestor::div[contains(@class,'MySpace_newsfeed-item__right')]//span[contains(@class,'MySpace_newsfeed-item__right-status')]`,
        );
        expect(status1).not.toBe(null);

        await pipeline1.click();

        await page.waitForTimeout(1000);

        let source = await page.waitForXPath(
          `//div[contains(@class,'NewsFeedItemInBell_hidden-details__files')]//ancestor::div[contains(@class,'NewsFeedItemInBell_hidden-details')]//span[contains(@class,'source') and contains(text(),'${projectCode}/admin')]`,
        );
        let destination = await page.waitForXPath(
          `//div[contains(@class,'NewsFeedItemInBell_hidden-details__files') ]//ancestor::div[contains(@class,'NewsFeedItemInBell_hidden-details')]//span[contains(@class,'destination') and contains(text(),'${projectCode}/admin')]`,
        );

        expect(source).not.toBe(null);
        expect(destination).not.toBe(null);

        let initator = await page.waitForXPath(
          `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]/ancestor::div[contains(@class,'MySpace_newsfeed-item__right')]//li//b[text()='You']`,
        );
        expect(initator).not.toBe(null);
      }
    });
});
