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
  selectGreenroomFile,
  findUserFolderDestination,
  coreSubFolderName,
  navigateToCore,
  cleanupGreenroom,
  waitForFileExplorer,
  navigateInsideFolder,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
const {
  generateLocalFile,
  createFolder,
} = require('../../../../utils/fileScaffoldActions');
const { adminProjectCode } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;
  let fileName;
  jest.setTimeout(700000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
  });
  it('Upload files to test project', async () => {
    let rootFolder = await createFolder(page);
    await navigateInsideFolder(page, rootFolder);
    let subFolder = await createFolder(page);
    await navigateInsideFolder(page, subFolder);
    tempFile = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (tempFile) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', tempFile);
    }
    fileName = rootFolder;
  });
  it('9.2.18 - User should select destination when copying files/folder otherwise an error message should display', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    const xCode = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-body")]/descendant::b',
    );
    const verificationCode = await page.evaluate(
      (xCode) => xCode.textContent,
      xCode,
    );
    await page.type('input[placeholder="Enter Code"]', verificationCode);

    const confirmFolder = await page.waitForXPath(
      '//span[contains(text(), "Confirm")]/parent::button',
    );
    await confirmFolder.click();

    const errorMessage = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-content")]/descendant::span[contains(text(), "*Select Destination") and contains(@style, "font-style: italic")]',
    );

    expect(errorMessage).toBeTruthy();
  });

  it('9.2.19 - In destination drop down menu, user could choose Core Home and all folder displayed in the Core Home', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    await findUserFolderDestination(page, admin.username);
    const coreFolder = await page.waitForXPath(
      `//div[@class="ant-modal-body"]//div[contains(@class, 'ant-tree-treenode')]//span[contains(@class, 'anticon-folder')]`,
      { timeout: 5000 },
    );
    expect(coreFolder).toBeTruthy();
  });

  it('9.2.20 - When selecting destination, if user selected folder contains sub folder, folder should expand to display sub folders for user to choose', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    await findUserFolderDestination(page, admin.username);
    const coreFolder = await page.waitForXPath(
      `//div[@class="ant-modal-body"]//div[contains(@class, 'ant-tree-treenode')]//span[contains(@class, 'anticon-folder')]`,
      { timeout: 5000 },
    );
    await coreFolder.click();
  });

  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
    await navigateToCore(page);
    await waitForFileExplorer(page, admin.username);
  });
});
