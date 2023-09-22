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
  navigateInsideFolder,
  uploadFile,
  cleanupGreenroom,
} = require('../../../../utils/greenroomActions.js');
const { createFolder } = require('../../../../utils/fileScaffoldActions');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const fs = require('fs');
const { projectCode } = dataConfig.fileUpload;

describe('1.5 Upload file/folder to existing folder', () => {
  let page;
  let folderName;
  jest.setTimeout(700000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('1.5 - Upload file 1G to existing folder', async () => {
    folderName = await createFolder(page);
    await navigateInsideFolder(page, folderName);
    const fileName = '1gb-test';
    if (!fs.existsSync(`${process.cwd()}/tests/uploads/temp/${fileName}`)) {
      await createDummyFile('temp', fileName, '1gb');
    }
    await uploadFile(page, 'temp', fileName);
  });

  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
  });
});
