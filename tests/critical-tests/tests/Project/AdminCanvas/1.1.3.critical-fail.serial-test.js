/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { admin } = require('../../../../users');
const { waitForRes } = require('../../../../utils/api');
const {
  waitForFileExplorer,
  createFolder,
  navigateInsideFolder,
  uploadFile,
  downloadFile,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions');

const { projectCode } = dataConfig.fileUpload;
jest.setTimeout(700000000);

describe('Project Admin Canvas - Charts', function () {
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
  });

  it('The number of upload and download matches today’s number of occurrence', async function () {
    const folderName = 'dddd';
    const folderPath = 'Test Files';
    const fileUpload = 'test001.md';

    await page.waitForTimeout(5000);

    const xUploadStat =
      "//ul[contains(@class, 'Cards_charts__meta')]/li/descendant::span[contains(text(), 'Uploaded')]/parent::div/div/span[2]";
    const xDownloadStat =
      "//ul[contains(@class, 'Cards_charts__meta')]/li/descendant::span[contains(text(), 'Downloaded')]/parent::div/div/span[2]";

    const beforeUploadStat = await page.waitForXPath(xUploadStat);
    const beforeUpload = await beforeUploadStat.evaluate(
      (node) => node.innerText,
    );
    const beforeDownloadStat = await page.waitForXPath(xDownloadStat);
    const beforeDownload = await page.evaluate(
      (node) => node.innerText,
      beforeDownloadStat,
    );

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await waitForFileExplorer(page, admin.username);
    await createFolder(page, folderName);
    await navigateInsideFolder(page, folderName);
    await uploadFile(page, folderPath, fileUpload);

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await navigateInsideFolder(page, folderName);
    await downloadFile(page, 15000, fileUpload);

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await deleteFileFromGreenroom(page, folderName);

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(5000);

    const afterUploadStat = await page.waitForXPath(xUploadStat);
    const afterUpload = await page.evaluate(
      (node) => node.innerText,
      afterUploadStat,
    );
    const afterDownloadStat = await page.waitForXPath(xDownloadStat);
    const afterDownload = await page.evaluate(
      (node) => node.innerText,
      afterDownloadStat,
    );

    expect(afterUpload - beforeUpload).toBe(1);
    expect(afterDownload - beforeDownload).toBe(1);
  });
});
