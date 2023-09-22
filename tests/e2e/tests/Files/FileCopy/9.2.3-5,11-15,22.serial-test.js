/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { admin } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const {
  copyFileToCore,
  selectGreenroomFile,
  navigateToCore,
  deleteAction,
  waitForTimeHash,
  uploadFile,
  uploadFolder,
  toggleFilePanel,
  checkFilePanelStatus,
  waitForFileExplorer,
} = require('../../../../utils/greenroomActions.js');
const { generateLocalFile } = require('../../../../utils/fileScaffoldActions');
const { adminProjectCode } = dataConfig.fileCopy;
const moment = require('moment');
const fs = require('fs');
describe('9.2 File Copy', () => {
  let page;
  let fileName;
  let folderName;

  const projectCode = adminProjectCode;

  jest.setTimeout(700000000);

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
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('Upload files to test project', async () => {
    fileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName);
    }
    folderName = `${moment().unix()}`;
    let srcDir = `${process.cwd()}/tests/uploads/Test Files/License.md`;
    let destDir = `${process.cwd()}/tests/uploads/temp/${folderName}`;
    const destFileName = `${moment().unix()}.md`;
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    await fs.copyFileSync(srcDir, destDir + '/' + destFileName);
    await uploadFolder(page, `temp/${folderName}`);
  });

  it('9.2.3, 9.2.4, 9.2.12, 9.2.22 - Greenroom raw copied files displayed in core', async () => {
    await copyFileToCore(page, admin.username, fileName);

    await navigateToCore(page);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const xCopiedFile = `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`;
    await page.waitForXPath(xCopiedFile, { timeout: 15000, visible: true });
    const copiedFile = await page.$x(xCopiedFile);

    expect(copiedFile.length).toBe(1);
  });

  it('9.2.13 - files that are in concurrent operations will be locked', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);

    await copyFileToCore(page, admin.username, folderName);
    await selectGreenroomFile(page, folderName);
    await deleteAction(page);

    await toggleFilePanel(page);

    const deleteTab = await page.waitForXPath('//span[text()="Trash Bin"]');
    await deleteTab.click();
    const deleteFailed = await page.waitForXPath(
      `//div[contains(@class, "Layout_deleted_list")]/descendant::li/descendant::span[contains(@aria-label, "close")]/following-sibling::span[contains(text(), "${folderName}")]/following-sibling::span[contains(text(), "Green Room")]`,
      { timeout: 120000 },
    );
    const file = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]/ancestor::tr`,
    );

    expect(deleteFailed).toBeTruthy();
    expect(file).toBeTruthy();
  });

  it('9.2.11 - Folder can be copied to a folder within core and displayed in core folder', async () => {
    await copyFileToCore(page, admin.username, fileName, folderName);
    await navigateToCore(page);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);
    await toggleFilePanel(page);

    const coreFolder = await page.waitForXPath(
      `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${folderName}')]`,
      {
        timeout: 15000,
        visible: true,
      },
    );
    await coreFolder.click();
    await page.waitForTimeout(3000);

    const xCopiedFile = `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`;
    await page.waitForXPath(xCopiedFile, { timeout: 15000, visible: true });
    const copiedFile = await page.$x(xCopiedFile);

    expect(copiedFile.length).toBe(1);
  });

  it('9.2.15 - Folder with the same name will be merged with internal files in core, files with the same name will have time hash added to file name', async () => {
    const dupeFileName = fileName.replace('.md', '');
    const targetName = folderName;

    await copyFileToCore(page, admin.username, targetName);
    await navigateToCore(page);

    const copiedFolder = await page.waitForXPath(
      `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${folderName}')]`,
    );
    await copiedFolder.click();
    await waitForFileExplorer(page, admin.username);

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, dupeFileName);
    const timeHash = await waitForTimeHash(page, dupeFileName);
    expect(timeHash).toBeTruthy();
  });

  it('9.2.14 - Files within a folder with the same name will have time hash added at the end of the file name', async () => {
    await copyFileToCore(page, admin.username, fileName);

    await navigateToCore(page);
    await waitForFileExplorer(page, admin.username);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);
    const dupeFileName = fileName.replace('.md', '');
    const timeHash = await waitForTimeHash(page, dupeFileName);

    expect(timeHash).toBeTruthy();
  });

  it('9.2.5, 9.2.23 - check for copy tag of recently copied', async () => {
    await selectGreenroomFile(page, fileName);
    await page.click('span[aria-label="copy"]');

    let tag;
    let tagText;
    try {
      tag = await page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/preceding-sibling::span[contains(@class, 'ant-tag')]`,
        { timeout: 2500 },
      );
      tagText = await tag.evaluate((el) => el.textContent);
    } catch (e) {
      console.log(e);
    }
    expect(tagText).toBe('copied-to-core');
  });
});
