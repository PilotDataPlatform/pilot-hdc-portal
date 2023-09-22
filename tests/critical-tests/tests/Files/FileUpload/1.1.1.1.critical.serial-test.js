/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  toggleFilePanel,
  checkFilePanelStatus,
  selectFileProperties,
  folderName,
  fileName,
  uploadAction,
  waitForFileExplorer,
  selectGreenroomFile,
  deleteAction,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('1.1.1 Files upload with tags', () => {
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

    if (fileInTable.length !== 0) {
      await selectGreenroomFile(page, file);
      await deleteAction(page);
    }
  }

  it('1.1.1.1 - File should be able to upload with a tag', async () => {
    const tagName = 'test';

    await page.waitForTimeout(5000);
    await removeExistFile(fileName);

    await uploadAction(page);
    const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    await uploadInputField.uploadFile(
      `${process.cwd()}/tests/uploads/${folderName}/${fileName}`,
    );
    const tagInput = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-body")]/form/descendant::input[@id="form_in_modal_tags"]',
    );
    await tagInput.type(tagName);

    await page.click('#file_upload_submit_btn');

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const uploadedFile = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    );
    expect(uploadedFile).toBeTruthy();

    await selectFileProperties(page, fileName);
    const tag = await page.waitForXPath(
      `//div[contains(@class, 'FileExplorer_customized_tags')]/following-sibling::div/span[contains(text(), "${tagName}")]`,
    );
    expect(tag).toBeTruthy();
  });

  it('Cleanup greenroom', async () => {
    await deleteFileFromGreenroom(page, fileName);
  });
});
