/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { submitCopyRequest } = require('../../../../utils/copyReqActions.js');
const {
  uploadFile,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions');
const {
  generateLocalFile,
  createFolder,
  removeLocalFile,
  clickIntoFolder,
  removeExistFile,
} = require('../../../../utils/fileScaffoldActions');
jest.setTimeout(700000);

const projectCode = dataConfig.copyReq.projectCode;

describe('CopyRequest', () => {
  let page;
  let folderName;
  let fileName1;
  let emptyFolderName;
  let fileInFolderName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1280 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    await removeLocalFile(fileName1);
    await deleteFileFromGreenroom(page, folderName);
    await page.waitForTimeout(3 * 1000);
    await deleteFileFromGreenroom(page, emptyFolderName);
    await page.waitForTimeout(10 * 1000);
    await logout(page);
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await page.waitForTimeout(3000);
    await cleanReqCreated();
  });
  async function cleanReqCreated() {
    let i = 1;
    while (i <= 5) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=1]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const firstItemNameNode = await page.$x(
        `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${folderName}")]`,
        {
          visible: true,
        },
      );
      if (firstItemNameNode.length) {
        const closeReqBtn = await page.waitForXPath(
          '//button[contains(span, "Close Request & Notify User")]',
        );
        await closeReqBtn.click();
        await page.waitForTimeout(1000);
        await page.type('textarea#notes', 'Automation test');
        const confirmBtn = await page.waitForXPath(
          '//div[contains(@class, "ant-modal-footer")]//button//span[contains(text(), "Confirm")]',
        );
        await confirmBtn.click();
        await page.waitForTimeout(3000);
      }
      i++;
    }
  }
  async function clickIntoFirstFolder() {
    const firstItemNameNode = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=3]//span',
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await page.waitForTimeout(5000);
  }
  it('prepare files', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    folderName = await createFolder(page);
    await clickIntoFolder(page, folderName);

    fileInFolderName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'tinified.zip',
    );
    if (fileInFolderName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileInFolderName);
    }

    await page.waitForTimeout(3000);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    emptyFolderName = await createFolder(page);
  });
  it('4.3.1 If a folder has been sent to request, any new added file into the folder after the request was made will not be part of the request.', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );

    await page.waitForTimeout(2000);
    const checkBox = await page.waitForXPath(
      `//tr//span[contains(text(),"${emptyFolderName}")]//ancestor::tr//span[@class="ant-checkbox"]`,
    );
    await checkBox.click();
    await submitCopyRequest(page);
    await page.waitForTimeout(5000);
    const firstItemNameNode = await page.waitForXPath(
      `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${emptyFolderName}")]`,
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await page.waitForTimeout(2000);

    fileName1 = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName1) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName1);
    }

    await page.waitForTimeout(3000);
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await clickIntoFirstFolder();
    await page.waitForTimeout(3000);
    const fileList = await page.$x(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr//td[position()=3]',
    );
    expect(fileList.length).toBe(0);
  });
  it('4.3.5 After a folder/file has been sent in a request, if it has been deleted, in the request it will be marked as not available (grey out), no approve/deny action can be executed on it.', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );

    const checkBox = await page.waitForXPath(
      `//tr//span[contains(text(),"${folderName}")]//ancestor::tr//span[@class="ant-checkbox"]`,
    );
    await checkBox.click();
    await submitCopyRequest(page);

    const firstItemNameNode = await page.waitForXPath(
      `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${folderName}")]`,
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await deleteFileFromGreenroom(page, fileInFolderName);
    await page.waitForTimeout(60 * 1000);
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await clickIntoFirstFolder();
    await page.waitForTimeout(3000);
    const deletedFileList = await page.$x(
      '//td[@class="ant-table-cell"]//span[text()="- Deleted"]',
    );
    expect(deletedFileList.length).toBe(1);
  });
  it('4.3.6 Greyed out file/folder can be reviewed of metadata in Properties, but can NOT be downloaded or zip previewed.', async () => {
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.hover();
    const downloadBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Download")]',
    );
    expect(downloadBtn.length).toBe(0);
    const previewBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Preview")]',
    );
    expect(previewBtn.length).toBe(0);
    const propsBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Properties")]',
    );
    expect(propsBtn.length).toBe(1);
  });
});
