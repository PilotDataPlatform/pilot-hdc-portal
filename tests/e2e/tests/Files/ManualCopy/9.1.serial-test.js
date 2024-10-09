/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const _ = require('lodash');

const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { admin } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const {
  navigateToCore,
  navigateInsideFolder,
  toggleFilePanel,
  checkFilePanelStatus,
  copyAction,
  findUserFolderDestination,
  selectGreenroomFile,
  fileName,
  folderName,
  cleanupGreenroom,
  uploadFile,
  uploadFolder,
  waitForFileExplorer,
  copyFileToCore,
} = require('../../../../utils/greenroomActions.js');
const { adminProjectCode } = dataConfig.fileCopy;

describe('9.1 Manual Copy Workflow', () => {
  let page;
  jest.setTimeout(7000000);

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
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('Upload files to test project', async () => {
    await uploadFile(page, folderName, fileName);
    await uploadFolder(page, folderName);
  });

  it('9.1.1 - Only project admin should be able to see the file copy button - "Copy to Core"', async () => {
    let adminCopyButton = await page.waitForSelector('span[aria-label="copy"]');
    expect(adminCopyButton).toBeTruthy();

    await logout(page);
    await login(page, 'collaborator');
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);

    let collabCopyButton;
    try {
      collabCopyButton = await page.waitForSelector('span[aria-label="copy"]', {
        timeout: 5000,
      });
    } catch {}
    expect(collabCopyButton).toBeFalsy();

    await logout(page);
    await login(page, 'admin');
  });

  it('9.1.2 - Both the files in greenroom home and files located inside folders have "Copy to Core" button', async () => {
    await selectGreenroomFile(page, fileName);
    const copyButton = await page.waitForSelector('span[aria-label="copy"]');
    expect(copyButton).toBeTruthy();

    const selectFolder = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]`,
    );
    await selectFolder.click();
    await selectGreenroomFile(page, fileName);
    const folderCopyButton = await page.waitForSelector(
      'span[aria-label="copy"]',
    );
    expect(folderCopyButton).toBeTruthy();
  });

  it('9.1.3 - File cannot be uploaded to core folder', async () => {
    await waitForFileExplorer(page, admin.username);
    await navigateToCore(page);
    let uploadButton;
    try {
      uploadButton = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-tabpane") and not(contains(@style, "visibility: hidden"))]/descendant::span[contains(text(), "Upload")]/parent::button',
        { timeout: 7500 },
      );
    } catch {}
    expect(uploadButton).toEqual({});
  });

  it('9.1.4, 9.1.5 - File copy to core requires code input confirmation and modal should have title "Copy to Core" and description detailing files being copied to core', async () => {
    await selectGreenroomFile(page, fileName);
    await copyAction(page);
    await findUserFolderDestination(page, admin.username);
    const [selectFolder] = await page.$x(
      '//span[contains(text(), "Select")]/parent::button',
    );
    await selectFolder.click();

    const confirmButton = await page.waitForXPath(
      '//span[contains(text(), "Confirm")]/parent::button',
    );
    await confirmButton.click();
    const verificationCodeMessage = await page.waitForXPath(
      '//div[contains(@class, "Copy2Core_copy_to_core_modal")]/descendant::span[contains(text(), "*Enter code")]',
    );
    expect(verificationCodeMessage).toBeTruthy();

    const modalHeader = await page.waitForXPath(
      '//div[contains(@class, "Copy2Core_copy_to_core_modal")]/descendant::div[contains(@class, "ant-modal-header")]/descendant::span[contains(text(), "Copy to Core")]',
    );
    expect(modalHeader).toBeTruthy();

    const fileDestinationDescription = await page.waitForXPath(
      `//div[contains(@class, "Copy2Core_copy_to_core_modal")]/descendant::p[contains(text(), "Selected file(s) will be copied to")]/following-sibling::p[contains(text(), 'Core / ${admin.username}')]`,
    );
    expect(fileDestinationDescription).toBeTruthy();
  });

  it('9.1.12 - User cannot select files outside and inside a folder', async () => {
    const getSelectAllCheckboxState = async () => {
      const selectAllCheckbox = await page.waitForXPath(
        '//div[contains(@class, "FileExplorer_files_raw_table")]/descendant::thead/descendant::span[contains(@class, "ant-checkbox")]',
      );
      return await selectAllCheckbox.evaluate((node) => {
        return node.classList.contains('ant-checkbox-indeterminate');
      });
    };

    await waitForFileExplorer(page, admin.username);
    await selectGreenroomFile(page, fileName);
    let isSelectAllChecked = await getSelectAllCheckboxState();
    expect(isSelectAllChecked).toBeTruthy();

    await navigateInsideFolder(page, folderName);
    await waitForFileExplorer(page, folderName);
    isSelectAllChecked = await getSelectAllCheckboxState();
    expect(isSelectAllChecked).toBeFalsy();

    await selectGreenroomFile(page, fileName);
    await page.waitForTimeout(2000);
    isSelectAllChecked = await getSelectAllCheckboxState();
    expect(isSelectAllChecked).toBeTruthy();
  });

  it('9.13 - Folder copied to core should remain in the same hierarchy', async () => {
    const getBreadcrumbPath = async () => {
      const breadcrumb = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-tabpane-active")]//nav[contains(@class, "FileExplorer_file_folder_path")]//li[last()]//span[contains(@class, "ant-breadcrumb-link")]',
      );
      return await breadcrumb.evaluate((ele) => ele.innerText);
    };

    await waitForFileExplorer(page, admin.username);
    const breadcrumbPath = await getBreadcrumbPath();
    await copyFileToCore(page, admin.username, fileName);

    await navigateToCore(page);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const copiedFile = await page.waitForXPath(
      `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`,
      { visible: true },
    );
    expect(copiedFile).toBeTruthy();

    const coreBreadcrumbPath = await getBreadcrumbPath();
    expect(coreBreadcrumbPath).toBe(breadcrumbPath);
  });

  it('9.14 - After folder copied to core, all files inside folder should keep original properties, including size, filename, tag and attribute', async () => {
    const getPropertiesOfAllFiles = async (page) => {
      const filesProperties = [];
      const filesActionButtons = await page.$x(
        '//div[contains(@class, "ant-table-content")]/descendant::td/button[contains(@class, "ant-dropdown-trigger")]',
      );
      for (let button of filesActionButtons) {
        await button.hover();
        await page.waitForTimeout(1500);
        const [properties] = await page.$x(
          '(//ul[contains(@class, "ant-dropdown-menu")]/li[contains(text(), "Properties")])[last()]',
        );

        await properties.evaluate((ele) => ele.click());
        await page.waitForTimeout(2000);

        const [nameProp] = await page.$x(
          '//div[contains(@class, "ant-descriptions-view")]/descendant::span[contains(text(), "Name")]/following-sibling::span',
        );
        const name = await nameProp.evaluate((ele) => ele.innerText);
        const [sizeProp] = await page.$x(
          '//div[contains(@class, "ant-descriptions-view")]/descendant::span[contains(text(), "File Size")]/following-sibling::span',
        );
        const size = await sizeProp.evaluate((ele) => ele.innerText);
        const tagsProp = await page.$x(
          '//div[contains(@class, "ant-descriptions-view")]/descendant::span[contains(@class, "ant-tag-blue")]',
        );
        const tags = await Promise.all(
          tagsProp.map(
            async (tag) => await page.evaluate((ele) => ele.innerText, tag),
          ),
        );

        filesProperties.push({
          name,
          size,
          tags,
        });
      }
      return filesProperties;
    };

    await waitForFileExplorer(page, admin.username);
    const folder = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]`,
    );
    await folder.click();
    await waitForFileExplorer(page, folderName);

    const files = await page.$x(
      '//div[contains(@class, "ant-table-content")]/descendant::tbody/descendant::tr/td[3]/descendant::span',
    );
    const fileNames = await Promise.all(
      files.map(
        async (file) => await page.evaluate((ele) => ele.innerText, file),
      ),
    );

    const greenroomFileProperties = await getPropertiesOfAllFiles(page);
    const greenroomHome = await page.waitForXPath(
      `//nav[contains(@class, "FileExplorer_file_folder_path")]//span[contains(@class, "ant-breadcrumb-link") and contains(text(), "${admin.username}")]`,
    );
    await greenroomHome.click();
    await page.waitForXPath(
      `//nav[contains(@class, "FileExplorer_file_folder_path")]//span[contains(@class, "ant-breadcrumb-link") and contains(text(), "${folderName}")]`,
      { hidden: true },
    );

    await copyFileToCore(page, admin.username, folderName);
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, folderName);
    await page.reload();
    await navigateToCore(page);
    await waitForFileExplorer(page, admin.username);
    await navigateInsideFolder(page, folderName);
    await Promise.all(
      fileNames.map(
        async (fileName) =>
          await page.waitForXPath(
            `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::div[contains(@class, "ant-table-content")]/descendant::tbody/descendant::tr/td[3]/descendant::span[contains(text(), "${fileName}")]`,
          ),
      ),
    );

    const coreFilesProperties = await getPropertiesOfAllFiles(page);
    const sortByFileName = (a, b) => {
      const valueA = a.name.toUpperCase();
      const valueB = b.name.toUpperCase();
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    };
    greenroomFileProperties.sort(sortByFileName);
    coreFilesProperties.sort(sortByFileName);

    expect(greenroomFileProperties.length).toBe(coreFilesProperties.length);
    greenroomFileProperties.forEach((file, index) => {
      expect(_.isEqual(file, coreFilesProperties[index])).toBeTruthy();
    });
  });

  // If there is another test suite that relies on the upload files, move this test to the last file that relies on uploaded files
  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
    await navigateToCore(page);
    await waitForFileExplorer(page, admin.username);
  });
});
