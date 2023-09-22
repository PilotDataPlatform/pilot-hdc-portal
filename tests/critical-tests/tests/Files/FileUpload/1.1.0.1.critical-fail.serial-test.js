/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const fs = require('fs');
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  folderName,
  uploadMultipleFiles,
  waitForFileExplorer,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('1.1.0 One or more file upload', () => {
  let page;
  const projectCode = dataConfig.fileUpload.projectCode;
  jest.setTimeout(7000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  async function removeExistFile(file) {
    let searchBtn = await page.waitForXPath(
      "//span[contains(@class,'search')]//parent::span",
    );
    await searchBtn.click();
    let nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(file);
    let searchFileBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchFileBtn.click();
    await page.waitForTimeout(2000);
    let fileInTable = await page.$x(
      `//td[@class='ant-table-cell']//span[text()='${file}']`,
    );

    if (fileInTable.length !== 0) {
      await deleteFileFromGreenroom(page, file);
    }
  }

  it('1.1.0.1 - Should be able to upload one or more than one file', async () => {
    const fileNames = fs.readdirSync(`./tests/uploads/${folderName}`);
    const filePaths = fileNames.map(
      (file) => `${process.cwd()}/tests/uploads/${folderName}/${file}`,
    );

    await waitForFileExplorer(page, admin.username);
    await uploadMultipleFiles(page, filePaths, fileNames);
  });

  it('Cleanup greenroom', async () => {
    const fileNames = fs.readdirSync(`./tests/uploads/${folderName}`);

    await waitForFileExplorer(page, admin.username);
    for (let file of fileNames) {
      await removeExistFile(file);
      const deletedFile = await page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
        { hidden: true },
      );
      expect(deletedFile).toBeNull();
    }
  });
});
