/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { admin } = require('../../../../users');
const {
  copyFileToCore,
  uploadFile,
  toggleFilePanel,
  checkFilePanelStatus,
  navigateToCore,
} = require('../../../../utils/greenroomActions.js');
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  removeExistFile,
} = require('../../../../utils/fileScaffoldActions');
const fs = require('fs');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('Collaborator Canvas', () => {
  let page;
  let fileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page._client().send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });
    await page.goto(baseUrl);
    await page.setViewport({ width: 1500, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('Prepare files', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    fileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName);
    }
    await copyFileToCore(page, admin.username, fileName);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const xCopiedFile = `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`;
    await page.waitForXPath(xCopiedFile, { timeout: 15000, visible: true });
    const copiedFile = await page.$x(xCopiedFile);

    expect(copiedFile.length).toBe(1);
  });
  it('3.5.8 Collaborator can download any files in core zone', async () => {
    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'collaborator');
    await init(page, { closeBanners: true });

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);
    await navigateToCore(page);
    const coreRoot = await page.waitForXPath(
      '//span[contains(@class,"ant-breadcrumb-link") and text()="Core"]',
    );
    await coreRoot.click();
    const adminNameFolder = await page.waitForXPath(
      `//td[@class='ant-table-cell']//span[text()='${admin.username}']`,
    );
    await adminNameFolder.click();
    const fileKebabBtn = await page.waitForXPath(
      '//span[text()="' +
        fileName +
        '"]//ancestor::td//following-sibling::td[@class="ant-table-cell"]//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await fileKebabBtn.click();
    const downloadBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Download")]',
    );
    await downloadBtn.click();
    await page.waitForTimeout(10000);
    await fs.readFileSync(`./tests/downloads/${fileName}`);
    await fs.unlinkSync(`./tests/downloads/${fileName}`);
  });
});
