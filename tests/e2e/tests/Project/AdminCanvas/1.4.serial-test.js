/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { admin, collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../../critical-tests/config');

const {
  fileName,
  folderName,
  waitForFileExplorer,
  uploadAction,
  toggleFilePanel,
  checkFilePanelStatus,
  deleteAction,
  selectGreenroomFile,
  clickFileAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
const { waitForRes } = require('../../../../utils/api');
const { generateLocalFile } = require('../../../../utils/fileScaffoldActions');
const { projectCode } = dataConfig.adminCanvas;
const moment = require('moment-timezone');
jest.setTimeout(700000);

describe('1.4 Canvas page – Recent File Stream ', () => {
  let timelinepage;
  let renamedFileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1366, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  async function getFileCreatedTime(fileName) {
    api = `/v1/project/activity-logs`;
    response = await waitForRes(page, api);
    let greenhomeFiles = response;

    for (let file of greenhomeFiles.result) {
      if (file['item_name'] === fileName) {
        let localTime = moment(new Date(file['activity_time']));
        return localTime;
      }
    }
    return null;
  }
  it('upload file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await waitForFileExplorer(page, admin.username);
    renamedFileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (renamedFileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', renamedFileName);
    }
  });

  it('1.4.1 Project admin could search download/upload/copy/delete/all activities in Recent File Stream. and 1.4.2 The operator in the log matches username and 1.4.3 Upload/download/copy/delete log matches device local time ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const username = await page.waitForXPath("//span[@id='header_username']");
    let usernameText = await page.evaluate((el) => el.textContent, username);

    const username_in_stream = await page.waitForXPath(
      `//span[text()='${renamedFileName}']//ancestor::div[contains(@class, "Cards_file")]//div[contains(@class,'file-descr')]//span[text()='${usernameText}']`,
    );
    expect(username_in_stream).toBeTruthy();

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    let fileCreatedTime = await getFileCreatedTime(renamedFileName);
    const timeBefore = moment().subtract(20, 'minutes');
    console.log(fileCreatedTime, timeBefore);
    expect(fileCreatedTime.isAfter(timeBefore)).toBeTruthy();
  });

  it('1.4.5,15 In today’s file stream, upload/download/copy/delete log only shows the current date logs.', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();

    const endDate = await page.waitForXPath("//input[@placeholder='End date']");
    let endDateText = await endDate.evaluate((el) => el.textContent);

    const timelines = await page.$x(
      "//div[@class='ant-timeline-item-content']",
    );
    if (timelines && timelines.length) {
      for (let timeline of timelines) {
        let timelineText = await timeline.evaluate((el) => el.textContent);
        if (!timelineText.includes(endDateText)) {
          expect(timeline).not.toBeTruthy();
          await page.waitForTimeout(2000);
        }
      }
    }
  });
  it('1.4.6 The header of Advanced search modal is “File Stream Advanced Search', async () => {
    const advancedTitle = await page.waitForXPath(
      "//div[@class='ant-modal-title' and contains(text(),'File Stream')]",
    );
    expect(advancedTitle).not.toBe(null);
  });
  it('1.4.8 The ‘Advanced search’ modal should only be closed by user click the cross on the top right corner', async () => {
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
  it('1.4.9,10,11,18 In ‘Advanced search’, search by other user upload/download/copy with/without range time', async () => {
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();
    const userDropDown = await page.waitForXPath(
      `//div[@class='ant-select-selector']//span[text()="All Users"]`,
    );
    await userDropDown.click();
    await page.waitForTimeout(2000);
    const user = await page.$x(
      "//div[@class='ant-select-item-option-content']",
    );
    expect(user.length).toBeGreaterThan(0);
  });
  it('1.4.12,13,14,19 In ‘Advanced search’, search login account’s self upload/download/copy with/without range time', async () => {
    const userDropDown = await page.waitForXPath(
      `//div[@class='ant-select-selector']//span[text()="All Users"]`,
    );
    await userDropDown.click();
    await page.waitForTimeout(2000);
    const user = await page.$x(
      "//div[@class='ant-select-item-option-content']",
    );
    expect(user.length).toBeGreaterThan(0);
    const admin = await page.$x(
      "//div[@class='ant-select-item-option-content' and text()='All Users']",
    );
    expect(admin.length).toBe(1);

    const type = await page.waitForXPath(
      "//div[contains(@class,'Modals_filterWrapper')]//span[@class='ant-select-selection-item' and text()='Upload']",
    );
    await type.click();

    const download = await page.waitForXPath(
      "//div[@class='ant-select-item-option-content' and text()='Download']",
    );
    await download.click();

    const startDate = await page.$x("//input[@placeholder='Start date']");
    await startDate.click();

    const first = await page.waitForXPath(
      "//div[@class='ant-picker-cell-inner' and text()=1]",
    );

    await first.click();

    const search = await page.waitForXPath(
      "//div[contains(@class,'Modals')]//button[@type='submit']",
    );
    await search.click();

    const timelinecontent = await page.waitForXPath(
      "//div[@class='ant-timeline-item-content']",
    );
    expect(timelinecontent).not.toBe(null);
  });
  it('1.4.22 Search result of deletion should provide original folder information, such as from Green room/Home to Trash or from Core/Home to Trash ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await selectGreenroomFile(page, renamedFileName);
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
  it('1.4.21 If search returns no result, then it should say ‘No result’', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();
    const userDropDown = await page.waitForXPath(
      `//div[@class='ant-select-selector']//span[text()="All Users"]`,
    );
    await userDropDown.click();
    const userOpt = await page.waitForXPath(
      `//div[contains(@class, 'ant-select-item-option-content') and text()='${collaborator.username}']`,
    );
    await userOpt.click();
    await page.click('#advanced_search_action');
    const copyOpt = await page.waitForXPath(
      `//div[contains(@class, 'ant-select-item-option-content') and text()='Copy']`,
    );
    await copyOpt.click();
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
