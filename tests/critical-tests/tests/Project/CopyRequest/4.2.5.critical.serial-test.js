/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  checkFile,
  submitCopyRequest,
} = require('../../../../utils/copyReqActions.js');
const { uploadFile } = require('../../../../utils/greenroomActions');
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  removeExistFile,
} = require('../../../../utils/fileScaffoldActions');
jest.setTimeout(700000);

const projectCode = dataConfig.copyReq.projectCode;

describe('CopyRequest', () => {
  let page;
  let fileName1;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page._client().send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    await removeLocalFile(fileName1);
    await removeExistFile(page, fileName1);
    await page.waitForTimeout(3000);
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findReqWithOneLeftItem(isFile = false) {
    for (let i = 1; i <= 10; i++) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=${i}]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const fileList = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr',
      );
      const checkBox = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      );
      const isFileList = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[contains(@class,"anticon-file")]',
      );

      if (isFile) {
        if (isFileList.length == 1 && checkBox.length && fileList.length == 1) {
          return;
        }
      }
    }
  }
  async function openApporveModal() {
    await page.waitForTimeout(1000);
    const firstCheckBox = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      {
        visible: true,
      },
    );
    await firstCheckBox.click();
    const approveBtn = await page.waitForXPath(
      '//button[contains(@class, "Widget_accept-icon")]',
      {
        visible: true,
      },
    );

    await approveBtn.click();
  }
  async function approveFirstItem() {
    await openApporveModal();
    const verificationPart = await page.waitForXPath(
      '//b[contains(@class, "Widget_no_select")]',
    );
    const verificationCode = await page.evaluate(
      (element) => element.textContent,
      verificationPart,
    );
    await page.type('.ant-modal-body input', verificationCode);
    await page.waitForTimeout(1000);
    const approveBtn = await page.waitForXPath(
      '//button[@class="ant-btn approve-btn ant-btn-primary"]',
    );
    await approveBtn.click();
    await page.waitForTimeout(1000);
  }

  it('prepare files and record', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    await page.waitForTimeout(2000);
    fileName1 = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName1) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName1);
    }
    try {
      await page.goto(`${baseUrl}project/${projectCode}/data`);
      await checkFile(page);
      await submitCopyRequest(page);
      await page.goto(`${baseUrl}project/${projectCode}/data`);
      await checkFile(page);
      await submitCopyRequest(page);
    } catch (e) {
      console.log('error while trying to create dummy data');
    }

    await logout(page);
    await login(page, 'admin');
  });

  it('4.2.5 Project admin should be able to select files/folders and approve. Once approved the copy will start immediately', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftItem(true);
    await approveFirstItem();
    const firstItemInTable = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]',
      {
        visible: true,
      },
    );
    const fileName = await page.evaluate((firstItemInTable) => {
      if (
        firstItemInTable &&
        firstItemInTable.children &&
        firstItemInTable.children.length > 6
      )
        return firstItemInTable.children[2].textContent;
    }, firstItemInTable);
    const filePanelBtn = await page.waitForXPath(
      '//span[contains(@class, "Layout_badge")]',
    );
    await filePanelBtn.click();
    const downloadItem = await page.waitForXPath(
      `//div[contains(@class, "Layout_progress_list")]//li//span[contains(text(),"${fileName}")]`,
    );
    expect(downloadItem).not.toBe(null);
  });
});
