/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
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
    const searchUserBtn = await page.waitForXPath(
      '//div[contains(@class, "Table_table_wrapper")]//span[@role="button"]',
    );
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type('disabletest');
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']//button[contains(@class,'ant-btn ant-btn-primary')]",
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
  it('8.2.8 Recent Activities page nation should be functional, such as change page or change number per page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await findDisabletestUser();
    const disabletestUser = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletestUser.length === 0) {
      const add_member = await page.waitForXPath(
        "//button[span[text()='Add Member']]",
      );
      await add_member.click();
      const userInput = await page.waitForXPath("//input[@id='email']");
      await userInput.type('disable.test@example.com');
      const submitBtn = await page.waitForXPath(
        "//button[span[text()='Submit']]",
      );
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }

    await page.waitForTimeout(6000);
    let count = 0;
    let changeRoleBtn;
    let okBtn;
    let role;

    while (count < 10) {
      try {
        changeRoleBtn = await page.waitForXPath(
          "//a[@class='ant-dropdown-link ant-dropdown-trigger' and text()='Change role ']",
        );
        await changeRoleBtn.click();
        role = await page.waitForXPath(
          "//li[@class='ant-dropdown-menu-item ant-dropdown-menu-item-only-child' and @aria-disabled='false' ][1]",
        );
        await role.click();
        okBtn = await page.waitForXPath(
          "//div[@class='ant-modal-confirm-btns']/button[span[text()='OK']]",
        );
        await okBtn.click();
      } catch (e) {
        console.log("error happens when changing user's role");
      }
      await page.waitForTimeout(3000);
      count += 1;
    }

    await page.goto(`${baseUrl}users`);

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

    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row') and @data-row-key='disabletest']/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and contains(span,'Profile')]",
    );
    await profileBtn.click();

    await page.waitForTimeout(3000);

    const firstDateLog = await page.$x(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const firstDateText = await firstDateLog[0].evaluate(
      (el) => el.textContent,
    );
    let nextPage = await page.waitForXPath(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
    );

    await nextPage.click();
    await page.waitForTimeout(3000);
    const nextPageLog = await page.$x(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const nextPageText = await nextPageLog[0].evaluate((el) => el.textContent);

    expect(nextPageText).not.toBe(firstDateText);
  });
  it('8.3.6 Recent Activities page nation should be functional, such as change page or change number per page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    const disabletestBtn = await page.waitForXPath(
      "//tr[@data-row-key='disabletest']/td/button",
    );
    await disabletestBtn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and  contains(span,'Profile')]",
    );
    await profileBtn.click();

    await page.waitForTimeout(3000);

    const firstDateLog = await page.$x(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const firstDateText = await firstDateLog[0].evaluate(
      (el) => el.textContent,
    );
    let nextPage = await page.waitForXPath(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
    );

    await nextPage.click();
    await page.waitForTimeout(3000);

    const nextPageLog = await page.$x(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const nextPageText = await nextPageLog[0].evaluate((el) => el.textContent);

    expect(nextPageText).not.toBe(firstDateText);
  });
  it('8.1.9 Recent Activities page nation should be functional, such as change page or change number per page', async () => {
    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'disabletest');
    await init(page, { closeBanners: true });

    await page.goto(`${baseUrl}user-profile`);

    await page.waitForTimeout(3000);
    await page.waitForXPath(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const firstDateLog = await page.$x(
      "//li[contains(@class, 'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const firstDateText = await firstDateLog[0].evaluate(
      (el) => el.textContent,
    );
    let nextPage = await page.waitForXPath(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
    );

    await nextPage.click();
    await page.waitForTimeout(3000);
    const nextPageLog = await page.$x(
      "//li[contains(@class,'UserProfile_activities-log__activity-item')]/div/div/span",
    );
    const nextPageText = await nextPageLog[0].evaluate((el) => el.textContent);

    expect(nextPageText).not.toBe(firstDateText);
  });
});
