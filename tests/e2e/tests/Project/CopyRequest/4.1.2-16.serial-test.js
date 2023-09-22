/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const moment = require('moment-timezone');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const fs = require('fs');
const {
  checkFile,
  submitCopyRequest,
} = require('../../../../utils/copyReqActions.js');
const {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');
const { uploadFile } = require('../../../../utils/greenroomActions.js');
const projectCode = dataConfig.copyReq.projectCode;
jest.setTimeout(700000);

describe('CopyRequest', () => {
  let page;
  let folderName;
  let fileName1;
  let fileName2;
  let zipFileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    await removeLocalFile(fileName1);
    await removeLocalFile(fileName2);
    await removeLocalFile(zipFileName);
    await removeExistFile(page, zipFileName);
    await page.waitForTimeout(2000);
    await removeExistFile(page, folderName);
    await page.waitForTimeout(2000);

    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('prepare files', async () => {
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

    fileName2 = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName2) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName2);
    }

    await page.waitForTimeout(3000);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);

    zipFileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'tinified.zip',
    );
    if (zipFileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', zipFileName);
    }
  });
  it('4.1.2 The Request to Core button should only in Greenroom tab', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const coreTab = await page.waitForXPath('//span[@id="core_title"]');
    await coreTab.click();
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
      { hidden: true },
    );
    expect(copyToRequestBtn).toBe(null);
  });
  it('4.1.3 User needs to select at least one file to click Request to Core', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
      { hidden: true },
    );
    expect(copyToRequestBtn).toBe(null);
  });
  it('4.1.4 User must input request notes to confirm request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    const selectDestinationBtn = await page.waitForXPath(
      '//button[@data-id="select_detination_btn"]',
    );
    await selectDestinationBtn.click();
    const corePath = await page.waitForXPath('//span[@title="Core"]');
    await corePath.click();
    const adminPath = await page.waitForXPath('//span[@title="admin"]');
    await adminPath.click();
    const selectBtn = await page.waitForXPath(
      '//button[@data-id="select_path_btn"]',
    );
    await selectBtn.click();
    const isConfirmBtnDisabled = await page.$eval(
      '.request2core_modal #btn_confirm',
      (button) => {
        return button.disabled;
      },
    );
    expect(isConfirmBtnDisabled).toBe(true);
  });
  it('4.1.5 Request notes must contain no more than 250 characters, support other language', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    const dummyText =
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis';
    await page.type('#notes', dummyText);

    const noteInputVal = await page.evaluate(
      () => document.querySelector('.request2core_modal #notes').value,
    );
    expect(noteInputVal).toBe(dummyText.slice(0, 250));
  });
  it('4.1.6 Request notes should be cleared after user submitted, cancel or closed model', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, folderName);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    await page.type('.request2core_modal #notes', 'This is a test note');
    const cancelBtn = await page.waitForXPath(
      '//div[contains(@class, "request2core_modal")]//button[contains(span, "Cancel")]',
    );
    await cancelBtn.click();
    await copyToRequestBtn.click();
    await page.waitForSelector('.request2core_modal #notes');
    const noteInputValAfterCancel = await page.evaluate(() => {
      const note = document.querySelector('.request2core_modal #notes');
      return note.value;
    });
    expect(noteInputValAfterCancel).toBe('');

    await copyToRequestBtn.click();
    await page.type('.request2core_modal #notes', 'This is a test note');
    const closeBtn = await page.waitForXPath(
      '//button[@class="ant-modal-close"]',
    );
    await closeBtn.click();
    await copyToRequestBtn.click();
    const noteInputValAfterClose = await page.evaluate(() => {
      const note = document.querySelector('.request2core_modal #notes');
      return note.value;
    });
    expect(noteInputValAfterClose).toBe('');

    await submitCopyRequest(page);

    await copyToRequestBtn.click();
    await page.waitForXPath('//button[@data-id="select_detination_btn"]');
    const noteInputValAfterSubmit = await page.evaluate(() => {
      const note = document.querySelector('.request2core_modal #notes');
      return note.value;
    });
    expect(noteInputValAfterSubmit).toBe('');
  });
  it('4.1.7 User must select destination to confirm request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, folderName);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    await page.type('.request2core_modal #notes', 'This is a test note');
    const folderPath = await page.waitForXPath(
      '//div[@data-id="folder-path"]',
      { hidden: true },
    );
    const isConfirmBtnDisabled = await page.$eval(
      '.request2core_modal #btn_confirm',
      (button) => {
        return button.disabled;
      },
    );
    expect(folderPath).toBe(null);
    expect(isConfirmBtnDisabled).toBe(true);
  });
  it('4.1.8 The default rule will be displayed on the top of the modal, and when hover it will display the complete rule', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, folderName);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    await page.waitForXPath(
      '//div[contains(@class, "request2core_modal")]//span[contains(text(), "Handling duplicate")]',
    );
    await page.hover(
      '.request2core_modal .ant-modal-title > p > span:nth-child(2) span ',
    );
    const ruleContent = await page.waitForXPath(
      '//div[@class="ant-popover-content"]//p[contains(text(), "Handling duplicate files")]',
      {
        visible: true,
      },
    );
    expect(ruleContent).not.toBe(null);
  });
  it('4.1.11 Project collaborator should be able to view all the files they have added, should be consistent with the file explorer at the time when adding them to copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const requestMenuItem = await page.waitForXPath(
      '//div[contains(@class, "ant-layout-sider-children")]//li[contains(@class,"ant-menu-item")]//span[contains(text(), "Requests")]/parent::a',
      {
        visible: true,
      },
    );
    await requestMenuItem.click();
    const firstItem = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=3]//span',
      {
        visible: true,
      },
    );
    const text = await page.evaluate(
      (element) => element.textContent,
      firstItem,
    );
    expect(text).toBe('test-folder-files');
  });
  it('4.1.11 Project collaborator should be able to view all the files they have added, should be consistent with the file explorer at the time when adding them to copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const checkBox = await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );
    await checkBox.click();
    const checkBox2 = await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr:nth-child(2) > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );
    await checkBox2.click();
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    await copyToRequestBtn.click();
    const fileList = await page.$x(
      '//p[contains(@class, "file_path_display")]',
    );
    expect(fileList.length).toBe(2);
  });
  it('4.1.12 Project collaborator could see the copy icon on the side bar', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const RequestMenuItem = await page.waitForXPath(
      '//div[contains(@class, "ant-layout-sider-children")]//li[contains(@class,"ant-menu-item")]//span[contains(text(), "Requests")]/parent::a',
      {
        visible: true,
      },
    );
    expect(RequestMenuItem).not.toBe(null);
  });
  it('4.1.13 User could submit same file to different copy request to different/the same destination folder', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, folderName);
    await submitCopyRequest(page);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, folderName);
    await submitCopyRequest(page);
  });
  it('4.1.15 User should be able to open any folder inside their request include empty folder', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );
    const newFolderBtn = await page.waitForXPath(
      '//button//span[contains(text(), "New Folder")]',
    );
    await newFolderBtn.click();
    await page.type('#folderName', 'test-empty-folder');
    const createFolderBtn = await page.waitForXPath(
      '//div[@class="ant-modal-footer"]//button//span[contains(text(), "Create")]',
    );
    await createFolderBtn.click();
    await page.waitForTimeout(2000);
    try {
      const closeBtn = await page.waitForXPath(
        '//span[@class="ant-modal-close-x"]',
      );
      await closeBtn.click();
    } catch (e) {
      console.log('close btn not found');
    }
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page, 'test-empty-folder');
    await submitCopyRequest(page);
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    const firstItem = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=3]//span',
      {
        visible: true,
      },
    );
    await firstItem.click();
  });
  it('4.1.16 The requested time for New request/Completed request should match user’s local time in different time zone', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const requestMenuItem = await page.waitForXPath(
      '//div[contains(@class, "ant-layout-sider-children")]//li[contains(@class,"ant-menu-item")]//span[contains(text(), "Requests")]/parent::a',
      {
        visible: true,
      },
    );
    await requestMenuItem.click();
    await page.waitForTimeout(3000);
    const firstReq = await page.waitForXPath(
      '//ul//li[contains(@class, "NewRequestsList_list_item") and position()=1]',
    );
    const firstReqText = await page.evaluate(
      (element) => element.textContent,
      firstReq,
    );
    const firstReqTime = firstReqText.split(' / ')[1];
    const dateReq = new Date(firstReqTime).valueOf();
    const dateCur = moment().valueOf();
    expect((dateCur - dateReq) / 1000.0).toBeLessThan(10 * 60);
  });
});
