/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { baseUrl, dataConfig } = require('../../../config');
const { init } = require('../../../../utils/commonActions.js');
const {
  checkFile,
  submitCopyRequest,
} = require('../../../../utils/copyReqActions.js');
jest.setTimeout(700000);

const projectCode = dataConfig.copyReq.projectCode;

describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
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
  async function findReqWithOneLeftFile() {
    for (let i = 1; i <= 10; i++) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=${i}]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const isFile = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[contains(@class,"anticon-file")]',
      );
      const fileList = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr',
      );
      const checkBox = await page.$x(
        '//div[contains(@class, "CopyDataToCoreRequest_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      );
      if (checkBox.length && fileList.length == 1 && isFile.length == 1) {
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
    await page.click('.ant-modal-footer button.approve-btn');
    await page.waitForTimeout(1000);
  }
  it('4.1.1 project admin will not have a button for requesting copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const checkBox = await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );
    await checkBox.click();
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
      { hidden: true },
    );
    expect(copyToRequestBtn).toBe(null);
  });
  it('4.1.1b Inside project, project admin could see the request icon, if new request received then there will be a red dot', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const redDot = await page.waitForSelector(
      '#side-bar li div.request-icon__dot',
      {
        visible: true,
      },
    );
    expect(redDot).not.toBe(null);
  });
  it('4.1.17 The copy request approval confirmation modal should be consistent with the copy-to-core modal in File Explorer', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftItem();
    await openApporveModal();
    await page.click('.ant-modal-footer button.approve-btn');
    await page.waitForTimeout(1000);
    const warningTxt = await page.waitForXPath(
      '//span[contains(text(), "*Enter code")]',
      {
        visible: true,
      },
    );
    expect(warningTxt).not.toBe(null);
  });
  it('4.1.18 The complete request modal shall be opened with empty notes', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftFile();
    await approveFirstItem();
    const closeReqBtn = await page.waitForXPath(
      '//button[contains(span, "Close Request & Notify User")]',
    );
    await closeReqBtn.click();
    const note = await page.waitForXPath(
      '//div[contains(@class, "CopyDataToCoreRequest_review_note_section")]//textarea',
    );
    await note.type('Automation test');
    await page.click('.ant-modal-close');
    await closeReqBtn.click();
    const noteNew = await page.evaluate(
      () => document.querySelector('.ant-modal-body #notes').value,
    );
    expect(noteNew).toBe('');

    await page.type('.ant-modal-body #notes', 'Automation test');
    const confirmBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-footer")]//button//span[contains(text(), "Confirm")]',
    );
    await confirmBtn.click();
    await findReqWithOneLeftItem();
    await approveFirstItem();
    await closeReqBtn.click();
    const noteNewModal = await page.evaluate(
      () => document.querySelector('.ant-modal-body #notes').value,
    );
    expect(noteNewModal).toBe('');
  });
});
