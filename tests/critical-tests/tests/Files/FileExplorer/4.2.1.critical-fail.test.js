/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  waitForFileExplorer,
} = require('../../../../utils/greenroomActions.js');

describe('4.2 File explorer should display properly', () => {
  let page;
  const projectCode = dataConfig.adminCanvas.projectCode;
  jest.setTimeout(7000000); //sets timeout for entire test suite

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

  it('4.2.1 - Folder path should always exist for Core and Greenrom even without any files', async () => {
    await page.waitForTimeout(3000);
    await waitForFileExplorer(page, admin.username);
    const breadcrumbGreenroom = page.waitForXPath(
      '//nav[contains(@class, "FileExplorer_file_folder_path")]//span[contains(text(), "Green Room")]',
    );
    const breadcrumbUsername = page.waitForXPath(
      `//nav[contains(@class, "FileExplorer_file_folder_path")]//span[contains(text(), "${admin.username}")]`,
    );

    const resolvedItems = await Promise.all([
      breadcrumbGreenroom,
      breadcrumbUsername,
    ]);

    for (let item of resolvedItems) {
      expect(item).toBeTruthy();
    }
  });
});
