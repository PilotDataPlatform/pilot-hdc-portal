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
  requestToCore,
} = require('../../../../utils/greenroomActions.js');

describe('Newsfeed ', () => {
  let fileName1;
  let fileName2;
  let folderName;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  async function findReqWithOneLeftItem() {
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
      if (checkBox.length && fileList.length == 1) {
        return;
      }
    }
  }

  async function openApporveModal() {
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

  it('upload file in namefolder', async () => {
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

    await requestToCore(page, 'admin', fileName1, 'test');
    await page.waitForTimeout(3000);
  });

  it('approve request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftItem();
    await openApporveModal();
    await page.click('.ant-modal-footer button.approve-btn');
    await page.waitForTimeout(1000);
  });

  it('My Project Admin Approved/Denied my copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/landing`);
    await page.waitForTimeout(3000);
    let pipeline1 = await page.waitForXPath(
      `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]`,
    );
    if (pipeline1) {
      let status1 = await page.waitForXPath(
        `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]/ancestor::div[contains(@class,'MySpace_newsfeed-item__right')]//span[contains(@class,'MySpace_newsfeed-item__right-status')]`,
      );
      expect(status1).not.toBe(null);

      let owner = await page.waitForXPath(
        `//span[contains(@class,'MySpace_newsfeed-item__right-time') and contains(text(),'${fileName1}')]/ancestor::div[contains(@class,'MySpace_newsfeed-item__right')]//li//b[text()='${collaborator.username}']`,
      );
      expect(owner).not.toBe(null);
    }
  });
  it('close copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await page.waitForTimeout(3000);

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
      await page.waitForTimeout(6000);
    }
  });
  it('close copy request', async () => {
    let newsfeed = await page.waitForXPath(
      `//span[contains(text(),"Closed ${collaborator.username}'s copy request")]`,
    );
    expect(newsfeed).not.toBe(null);
  });
});
