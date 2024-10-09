/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { clearInput, clearSelector } = require('../../../../utils/inputBox.js');
const { init } = require('../../../../utils/commonActions.js');
const {
  createSimpleManifest,
  fillSimpleManifest,
} = require('../../../../utils/manifest.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  uploadFile,
  deleteAction,
  deleteFileFromGreenroom,
  selectGreenroomFile,
  clickFileAction,
} = require('../../../../utils/greenroomActions.js');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const { collaborator, admin } = require('../../../../users');
const fs = require('fs');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('1.5.13', () => {
  let page;
  const fileName = 'License.md';
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page._client().send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });
    await page.goto(baseUrl);
    await page.setViewport({ width: 1500, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function removeExistFile(file) {
    const searchB = await page.waitForXPath(
      "//span[contains(@class,'search')]",
    );
    await searchB.click();
    const fileInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await fileInput.type(file);
    const searchFileBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchFileBtn.click();
    await page.waitForTimeout(2000);
    let fileInTable = await page.$x(
      `//td[@class='ant-table-cell']//span[text()='${file}']`,
    );

    if (fileInTable.length !== 0) {
      await selectGreenroomFile(page, file);
      await deleteAction(page);
    }
  }
  it('prepare file for test', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    if (!fs.existsSync(`${process.cwd()}/tests/uploads/test/${fileName}`)) {
      await createDummyFile('Test Files', fileName, '10kb');
    }
    await page.waitForTimeout(6000);
    await removeExistFile(fileName);
    await page.waitForTimeout(3000);
    await clickFileAction(page, 'Refresh');
    await page.waitForTimeout(6000);
    await uploadFile(page, 'Test Files', fileName);
  });
  it("Project admin could access any users' name folder download any file", async () => {
    await logout(page);
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);
    await page.waitForXPath(
      '//nav[contains(@class, "FileExplorer_file_folder_path")]//span[@class="ant-breadcrumb-link" and text()="' +
        admin.username +
        '"]',
      { visible: true },
    );
    const greenroomBtn = await page.waitForXPath(
      '//nav[contains(@class, "FileExplorer_file_folder_path")]//span[@class="ant-breadcrumb-link" and text()="Green Room"]',
      { visible: true },
    );
    await greenroomBtn.click();
    await page.waitForTimeout(3000);
    const searchNameTrigger = await page.waitForXPath(
      '//span[contains(@class, "ant-table-filter-trigger-container")]',
      { visible: true },
    );
    await searchNameTrigger.click();
    const nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(collaborator.username);
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchBtn.click();
    await page.waitForTimeout(3000);

    const userFolder = await page.waitForXPath(
      '//td[contains(@class, "ant-table-cell")]//span[text()="' +
        collaborator.username +
        '"]',
      { visible: true },
    );
    await userFolder.click();
    await page.waitForTimeout(3000);

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
