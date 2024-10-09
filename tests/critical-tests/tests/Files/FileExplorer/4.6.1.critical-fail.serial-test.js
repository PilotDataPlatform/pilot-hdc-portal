/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  uploadFile,
  waitForFileExplorer,
  selectFileProperties,
  fileName,
  folderName,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('4.6 File tag could be added / removed in file details panel', () => {
  let page;
  const projectCode = dataConfig.fileUpload.projectCode;
  jest.setTimeout(7000000);

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

  it('4.6.1 - Add tag in file details', async () => {
    const tagName = 'test';

    await waitForFileExplorer(page, admin.username);
    await selectFileProperties(page, fileName);

    await page.click('span.site-tag-plus');
    const tagInput = await page.waitForXPath(
      '//span[contains(@class, "ant-descriptions-item-content")]/descendant::input',
    );
    await tagInput.type(tagName);
    await page.keyboard.press('Enter');
    const saveTag = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_customized_tags")]/descendant::button',
    );
    await saveTag.click();

    const newTag = await page.waitForXPath(
      `//div[contains(@class, 'FileExplorer_customized_tags')]/following-sibling::div/span[contains(text(), "${tagName}")]`,
    );
    expect(newTag).toBeTruthy();
  });

  it('Cleanup greenroom', async () => {
    await deleteFileFromGreenroom(page, fileName);
  });
});
