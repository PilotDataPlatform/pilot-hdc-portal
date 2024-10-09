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
const { uploadFile } = require('../../../../utils/greenroomActions');
const { generateLocalFile } = require('../../../../utils/fileScaffoldActions');
jest.setTimeout(700000);

const projectCode = dataConfig.copyReq.projectCode;

describe('CopyRequest', () => {
  let page;
  let zipFileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1280 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
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
  it('prepare files', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');

    zipFileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'tinified.zip',
    );
    if (zipFileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', zipFileName);
    }
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );

    await page.waitForTimeout(2000);
    const checkBox = await page.waitForXPath(
      `//tr//span[contains(text(),"${zipFileName}")]//ancestor::tr//span[@class="ant-checkbox"]`,
    );
    await checkBox.click();
    await submitCopyRequest(page);
  });
  it('4.3.2 File/folders in the request can be reviewed of streaming metadata (tags, attributes, lineage)', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftFile();
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.hover();
    const propertiesBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Properties")]',
    );
    await propertiesBtn.click();
    await page.waitForTimeout(10000);

    const lineageGraph = await page.waitForXPath(
      '//span[contains(text(), "Data Lineage Graph")]',
    );
    await lineageGraph.click();
  });
  it('4.3.4 File/folders in the request can be zip previewed if it is a zip. ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await findReqWithOneLeftFile();
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.hover();
    const previewBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and contains(span, "Preview")]',
    );
    await previewBtn.click();
    await page.waitForXPath(
      '//div[@class="ant-modal-title"]//div[contains(span, "File Previewer")]',
    );
  });
});
