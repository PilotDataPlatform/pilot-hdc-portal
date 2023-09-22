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
const {
  ExplorerActions,
} = require('../../../../../src/Views/Dataset/DatasetData/Components/ExplorerActions/ExplorerActions.jsx');

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
  it('perpare project announcement', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    const announcementContent = await page.waitForXPath(
      '//div[text()="Create new announcement"]',
    );
    if (announcementContent) {
      const InputText = 'test announcement';
      await page.click('#announcement', {
        clickCount: 1,
      });
      await page.keyboard.press('Backspace');
      await page.type('#announcement', InputText);
      let submitBtn = await page.waitForXPath(
        '//button//span[text()="Publish"]',
      );
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  }),
    it('Platform-wise Notifications (Maintenance), Project-wise Announcements', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/landing`);
      await page.waitForTimeout(3000);

      let announcemnet = await page.waitForXPath(
        "//span[contains(@class,'MySpace_newsfeed-item__right-action') and text()='Project Announcement']",
      );

      expect(announcemnet).not.toBe(null);

      let maintenance = await page.waitForXPath(
        "//span[contains(@class,'MySpace_newsfeed-item__right-action') and text()='Upcoming Maintenance']",
      );
      expect(maintenance).not.toBe(null);
    });
});
