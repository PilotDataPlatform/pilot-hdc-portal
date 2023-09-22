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
const { projectCode } = dataConfig.fileDelete;
const {
  selectGreenroomFile,
  fileName,
  folderName,
  uploadFile,
  deleteAction,
  checkFilePanelStatus,
  waitForFileExplorer,
  toggleFilePanel,
} = require('../../../../utils/greenroomActions.js');

describe('3.2 The selected file/folder can be deleted by using delete button', () => {
  let page;
  jest.setTimeout(7000000);
  async function removeExistFile(file) {
    const search = await page.waitForXPath(
      "//tr//th[position()=3]//span[contains(@class,'search')]",
    );
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

  it('Upload files to test project', async () => {
    await uploadFile(page, folderName, fileName);
  });

  it('3.2.1 - The file will have "to be deleted" tag after clicking the delete button', async () => {
    await waitForFileExplorer(page, admin.username);
    await removeExistFile(fileName);
    const deleteTag = page.waitForXPath(
      '//div[contains(@class, "ant-tabs-tabpane-active")]/descendant::div[contains(@class, "ant-table-layout")]/descendant::td[3]/descendant::span[contains(text(), "to be deleted")]',
    );
    expect(deleteTag).toBeTruthy();

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);
  });
});
