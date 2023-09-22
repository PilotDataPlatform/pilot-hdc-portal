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
  toggleFilePanel,
  checkFilePanelStatus,
  selectFileProperties,
  folderName,
  fileName,
  uploadAction,
  waitForFileExplorer,
  cleanupGreenroom,
} = require('../../../../utils/greenroomActions.js');
const {
  hasExistingManifest,
  createSimpleManifest,
  selectManifestDuringUpload,
  ATTR_NAME,
  ATTR_VALS,
} = require('../../../../utils/manifest');

describe('1.1.2 File upload with attribute', () => {
  let page;
  const projectCode = dataConfig.fileUpload.projectCode;
  const manifestName = 'test manifest';
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

  it('Check if there is an existing manifest', async () => {
    const hasManifest = await hasExistingManifest(page);
    if (!hasManifest) {
      await createSimpleManifest(page, manifestName);
    }
  });

  it('1.1.2.1 - Can attach a file manifest to file when uploading but optional, uploaded file should have attached manifest', async () => {
    await waitForFileExplorer(page, admin.username);

    await uploadAction(page);
    const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    await uploadInputField.uploadFile(
      `${process.cwd()}/tests/uploads/${folderName}/${fileName}`,
    );

    await selectManifestDuringUpload(page, manifestName, ATTR_VALS[0]);
    await page.click('#file_upload_submit_btn');

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const uploadedFile = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    );
    expect(uploadedFile).toBeTruthy();

    await selectFileProperties(page, fileName);
    const fileAttributesPanel = await page.waitForXPath(
      '//div[contains(@class, "ant-collapse-header") and contains(text(), "File Attributes")]',
    );
    await fileAttributesPanel.click();

    const manifestDetails = await Promise.all([
      page.waitForXPath(
        `//div[contains(@class, "ant-collapse-header") and contains(text(), "File Attributes")]/following-sibling::div/descendant::h3[contains(text(), "${manifestName}")]`,
      ),
      page.waitForXPath(
        `//div[contains(@class, "ant-collapse-header") and contains(text(), "File Attributes")]/following-sibling::div/descendant::h3[contains(text(), "${manifestName}")]/parent::div/descendant::table/descendant::span[contains(text(), "${ATTR_NAME}")]`,
      ),
      page.waitForXPath(
        `//div[contains(@class, "ant-collapse-header") and contains(text(), "File Attributes")]/following-sibling::div/descendant::h3[contains(text(), "test manifest")]/parent::div/descendant::table/descendant::span/span[contains(text(), "${ATTR_VALS[0]}")]`,
      ),
    ]);

    for (let item of manifestDetails) {
      expect(item).toBeTruthy();
    }
  });

  it('Cleanup greenroom', async () => {
    await cleanupGreenroom(page);
  });
});
