/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator, disabletest } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.userProfile;
jest.setTimeout(700000);

describe('User profile', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1300, height: 600 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findDisabletestUser() {
    const searchUserBtn = await page.waitForXPath("//span[@role='button']");
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type('disabletest');
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']/div/div/div/button[contains(@class,'ant-btn ant-btn-primary')]",
    );
    await searchBtn.click();

    await page.waitForTimeout(3000);
  }
  async function clickBtnInUser() {
    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row') and @data-row-key='disabletest']/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
  }
  async function addMember() {
    await page.waitForTimeout(3000);
    const add_member = await page.waitForXPath(
      "//button[span[text()='Add Member']]",
    );
    await add_member.click();
    const userInput = await page.waitForXPath("//input[@id='email']");
    await userInput.type(disabletest.email);
    const submitBtn = await page.waitForXPath(
      "//button[span[text()='Submit']]",
    );
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }

  it('8.3.5 User’s project record should be kept after user removed from the project, so once reinvited back to the project, project admin could see the removed log', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const disabletestUsr = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletestUsr.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(6000);

    let disabletestBtn = await page.waitForXPath(
      "//tr[@data-row-key='disabletest']/td/button",
    );
    await disabletestBtn.click();
    const removeBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Delete')]",
    );
    await removeBtn.click();
    let okBtn = await page.waitForXPath(
      "//div[@class='ant-modal-confirm-btns']/button[span[text()='OK']]",
    );
    await okBtn.click();
    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");

    await addMember();

    disabletestBtn = await page.waitForXPath(
      "//tr[@data-row-key='disabletest']/td/button",
    );
    await disabletestBtn.click();

    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Profile')]",
    );
    await profileBtn.click();

    var lastPage = await page.$x(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
    );
    while (lastPage.length === 0) {
      var nextPage = await page.waitForXPath(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
      );

      await nextPage.click();
      await page.waitForTimeout(3000);
      lastPage = await page.$x(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
      );
      console.log(lastPage.length);
    }
    const accountDisabledLog = await page.$x(
      "//div[contains(@class,'activity-item__action')]/div/div/div/span[text()='Account Disabled']",
    );
    const accountEnableLog = await page.$x(
      "//div[contains(@class,'activity-item__action')]/div/div/div/span[text()='Account Activated']",
    );

    expect(accountDisabledLog.length).toBeGreaterThan(0);
    expect(accountEnableLog.length).toBeGreaterThan(0);
  });
});
