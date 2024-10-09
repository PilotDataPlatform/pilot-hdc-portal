/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig, mailHogHost } = require('../../../config');
const {
  requestToCore,
  fileName,
  folderName,
  uploadFile,
  uploadFolder,
  waitForFileExplorer,
} = require('../../../../utils/greenroomActions.js');
const {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions');

const { collaboratorProjectCode } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;

  let fileName;
  jest.setTimeout(700000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${collaboratorProjectCode}/data`);
  });

  afterAll(async () => {
    await page.goto(`${baseUrl}project/${collaboratorProjectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    await removeLocalFile(fileName);
    await removeExistFile(page, fileName);
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('prepare files', async () => {
    await page.goto(`${baseUrl}project/${collaboratorProjectCode}/data`);
    await page.waitForSelector('#files_table > div > div > table > tbody > tr');
    fileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName);
    }
  });
  it('9.2.2 - File copy from raw to core requires confirmation from Project Admin', async () => {
    const projectTitle = await page.waitForXPath(
      '//span[contains(@class, "ant-page-header-heading-title")]/descendant::span',
    );
    const projectName = await page.evaluate(
      (ele) => ele.innerText,
      projectTitle,
    );
    await waitForFileExplorer(page, collaborator.username);
    await requestToCore(page, collaborator.username, fileName);
    await page.waitForTimeout(5000);

    await page.goto(mailHogHost);
    await waitForRes(page, '/api/v2/messages');
    await page.waitForXPath(
      `//span[contains(@class, "subject") and contains(text(), "A new request to copy data to Core needs your approval")]`,
    );
  });
});
