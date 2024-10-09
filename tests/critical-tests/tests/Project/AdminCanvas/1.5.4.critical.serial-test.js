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
  deleteFileFromGreenroom,
  selectGreenroomFile,
  clickFileAction,
  deleteAction
} = require('../../../../utils/greenroomActions.js');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const fs = require('fs');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('1.5.4', () => {
  let page;
  const fileName = 'auto-file-manifest-test';
  const manifestName = 'Auto Manifest';
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1500, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function removeExistFile(file) {
    const search = await page.waitForXPath("//span[contains(@class,'search')]");
    await search.click();
    const nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(file);
    const searchFileBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchFileBtn.click();
    await page.waitForTimeout(2000);
    let fileInTable = await page.$x(
      `//td[@class='ant-table-cell']//span[text()='${file}']`,
    );
    if (fileInTable.length > 0) {
      await deleteFileFromGreenroom(page, file)
    }
  }
  it('prepare manifest and file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForTimeout(3000);
    const manifestTab = await page.waitForXPath(
      '//div[text()="File Attributes"]',
    );
    await manifestTab.click();
    await page.waitForTimeout(3000);
    const manifestExist = await page.$x(
      '//div[contains(@class, "Settings_manifestList")]//b[text()="' +
        manifestName +
        '"]',
    );
    if (manifestExist.length === 0) {
      await createSimpleManifest(page, manifestName);
    }
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    if (!fs.existsSync(`${process.cwd()}/tests/uploads/test/${fileName}`)) {
      await createDummyFile('test', fileName, '10kb');
    }
    await page.waitForTimeout(6000);
    await removeExistFile(fileName);
    await page.waitForTimeout(3000);
    await clickFileAction(page, 'Refresh');
    await page.waitForTimeout(6000);
    await uploadFile(page, 'test', fileName);
  });
  it('Attach manifest to any file in the project that does not have a manifest yet', async () => {
    await page.waitForTimeout(3000);
    await selectGreenroomFile(page, fileName);
    await clickFileAction(page, 'Add Attributes');
    const stepBtnForManifest = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_explore_actions")]//button[contains(@class, "ant-btn-background-ghost")]//span[text()="Add Attributes"]',
    );
    await stepBtnForManifest.click();
    await fillSimpleManifest(page, manifestName);
    const fileKebabBtn = await page.waitForXPath(
      '//span[text()="' +
        fileName +
        '"]//ancestor::td//following-sibling::td[@class="ant-table-cell"]//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await fileKebabBtn.click();
    const propertiesBtn = await page.waitForXPath(
      '//li[text()="Properties" and contains(@class, "ant-dropdown-menu-item")]',
    );
    await propertiesBtn.click();
    const fileAttributesPanel = await page.waitForXPath(
      '//div[@class="ant-collapse-item"]//div[contains(text(), "File Attributes")]',
    );
    await fileAttributesPanel.click();
    const manifestTitle = await page.waitForXPath(
      '//div[@class="ant-collapse-content-box"]//h3',
    );
    const manifestTitleTxt = await page.evaluate(
      (ele) => ele.textContent,
      manifestTitle,
    );
    expect(manifestTitleTxt).toBe(manifestName);
    await page.waitForTimeout(2000);
  });
  it('Delete test files from test project', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);
    await deleteFileFromGreenroom(page, fileName);
    await page.waitForTimeout(5000);
  });
});
