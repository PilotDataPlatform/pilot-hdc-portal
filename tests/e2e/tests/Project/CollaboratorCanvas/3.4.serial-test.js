/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const {
  selectGreenroomFile,
  clickFileAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

const {
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');

describe('Project Canvas – Recent File Stream', () => {
  let page;
  let fileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1366, height: 900 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('upload file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    fileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName);
    }
  });
  it('2.4.1 The operator in the log matches username', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(3000);
    const username = await page.$x("//span[@id='header_username']");

    let usernameText = await username[0].evaluate((el) => el.textContent);

    const opearterName = await page.waitForXPath(
      `//div[contains(@class,'Cards_card')]//span[contains(@class,'Cards_user-name' ) and text()='${usernameText}']`,
    );

    expect(opearterName).not.toBe(null);
  });

  it('2.4.2 In ‘Advanced search’, search by time range upload, should not contain future dates', async () => {
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();

    const endDate = await page.$x("//input[@placeholder='End date']");
    let endDateText = await endDate[0].evaluate((el) => el.textContent);

    const timelines = await page.$x(
      "//div[@class='ant-timeline-item-content']",
    );

    for (let timeline of timelines) {
      let timelineText = await timeline.evaluate((el) => el.textContent);
      if (!timelineText.includes(endDateText)) {
        expect(timeline).not.toBeTruthy();
        await page.waitForTimeout(2000);
      }
    }
  });
  it('2.4.4 In ‘Advanced search’, search by other user upload/download/delete/all, should not give any option except collaborator self', async () => {
    const userDropDown = await page.waitForXPath(
      "//input[@id='advanced_search_user']",
    );
    await userDropDown.click();
    const user = await page.$x(
      "//div[@class='ant-select-item-option-content']",
    );
    expect(user.length).toBe(1);
  });
  it('2.4.10 The ‘Advanced search’ modal should only be closed by user click the cross on the top right corner', async () => {
    const closeAdvancedBtn = await page.waitForXPath(
      "//span[@aria-label='close']",
    );
    await closeAdvancedBtn.click();
    const advancedTitle = await page.waitForXPath(
      "//div[@class='ant-modal-title' and contains(text(),'File Stream')]",
      { hidden: true },
    );
    expect(advancedTitle).toBeTruthy();
  });
  it('2.4.9 Search result of deletion should provide original folder information, such as from Green room/Home to Trash or from Core/Home to Trash ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await page.waitForTimeout(3000);
    await selectGreenroomFile(page, fileName);
    await clickFileAction(page, 'Delete');
    await page.waitForXPath(
      '//div[contains(@class, "ant-modal-title") and contains(text(), "Delete Files")]',
      {
        visible: true,
      },
    );
    const deleteMsg = await page.waitForXPath(
      "//div[@class='ant-modal-body']//p[contains(text(),'sent')]",
    );
    expect(deleteMsg).not.toBe(null);
    await page.waitForTimeout(2000);
    const modalConfirmButton = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-footer")]/descendant::button/descendant::span[contains(text(), "OK")]/ancestor::button',
    );
    await modalConfirmButton.click();
    await page.waitForTimeout(3000);
  });
  it('2.4.8 If search returns no result, then it should say ‘No result’', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();
    const userDropDown = await page.waitForXPath(
      `//label[text()="User"]/parent::*/following-sibling::div//div[@class='ant-select-selector']`,
    );
    await userDropDown.click();
    const userOpt = await page.waitForXPath(
      `//div[contains(@class, 'ant-select-item-option-content') and text()='${collaborator.username}']`,
    );
    await userOpt.click();
    await page.click('#advanced_search_action');
    const downloadOpt = await page.waitForXPath(
      `//div[contains(@class, 'ant-select-item-option-content') and text()='Download']`,
    );
    await downloadOpt.click();
    const search = await page.waitForXPath(
      `//form[@id="advanced_search"]//span[text()='Search']`,
    );
    await search.click();

    const emptyDescr = await page.waitForXPath(
      "//div[@class='ant-empty-description']",
    );
    expect(emptyDescr).toBeTruthy();
  });
});
