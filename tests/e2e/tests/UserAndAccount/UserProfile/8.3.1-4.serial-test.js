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
    await page.setViewport({ width: 1300, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function addMember() {
    const add_member = await page.waitForXPath(
      "//button[span[text()='Add Member']]",
    );
    await add_member.click();
    await page.waitForTimeout(2000);
    const userInput = await page.waitForXPath("//input[@id='email']");
    await userInput.type(disabletest.email);
    const submitBtn = await page.waitForXPath(
      "//button[span[text()='Submit']]",
    );
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }
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
  it("8.3.1 Project admin could see project members' profile in the teams page by clicking ‘Action’ button and select ‘profile’, then Member Profile modal should pop up", async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await findDisabletestUser();

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    let disabletestUser = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletestUser.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(6000);

    const disabletestBtn = await page.waitForXPath(
      "//tr[@data-row-key='disabletest']/td/button",
    );
    await disabletestBtn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and  contains(span,'Profile')]",
    );
    await profileBtn.click();

    const profileModal = await page.waitForXPath(
      "//div[@class='ant-modal-title' and text()='Member Profile']",
    );
    expect(profileModal).not.toBe(null);
  });
  it('8.3.2 Member profile should have 2 main sections: User Information and Recent Activities', async () => {
    const userInfo = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='User Information']",
    );
    expect(userInfo).not.toBe(null);

    const recentActivities = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Recent Activities']",
    );
    expect(recentActivities).not.toBe(null);
  });
  it('8.3.3 User Information should contain following fields:Username,First Name,Last Name,Email,Join Date,Last login', async () => {
    await page.waitForXPath(
      "//li[contains(@class,'UserProfile_content__user-meta')]/div/div[@class='ant-col']/span[text()!='Username' and text()!='First Name' and text() != 'Last Name' and text() != 'Email' and text() != 'Join Date' and text() != 'Last Login']",
    );

    var userFill = await page.$x(
      "//li[contains(@class,'UserProfile_content__user-meta')]/div/div[@class='ant-col']/span[text()!='Username' and text()!='First Name' and text() != 'Last Name' and text() != 'Email' and text() != 'Join Date' and text() != 'Last Login']",
    );
    expect(userFill.length).toBe(4);
    var infoFill = await page.$x(
      "//li[contains(@class,'UserProfile_content__user-login')]/div/div[@class='ant-col']/span[text()!='Username' and text()!='First Name' and text() != 'Last Name' and text() != 'Email' and text() != 'Join Date' and text() != 'Last Login']",
    );
    expect(infoFill.length).toBe(2);
  });
  it('8.3.4 Recent Activities:<project-Name>,Date: yyy-mm-dd-HH:MM:SS,Action: invited,activate,role change', async () => {
    const projectName = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Recent Activities']/span",
    );
    expect(projectName).not.toBe(null);

    await page.waitForXPath(
      "//li[contains(@class,'UserProfile_activities-log')]/div/div/span",
    );
    const date = await page.$x(
      "//li[contains(@class,'UserProfile_activities-log')]/div/div/span",
    );
    expect(date.length).toBeGreaterThan(0);
    const dateValue = await date[0].evaluate((el) => el.textContent);
    var format = false;
    var myRegExp =
      /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    if (dateValue.match(myRegExp)) {
      format = true;
    }
    expect(format).toBe(true);

    const activate = await page.$x(
      "//span[@role='img' and @aria-label='check' and contains(@class,' anticon-check')]",
    );
    expect(activate.length).toBeGreaterThan(0);

    const Invited = await page.$x(
      "//span[@role='img' and @aria-label='mail' and contains(@class,' anticon-mail')]",
    );
    expect(Invited.length).toBeGreaterThan(0);

    const change = await page.$x(
      "//span[@role='img' and @aria-label='retweet' and contains(@class,' anticon-retweet')]",
    );
    expect(change.length).toBeGreaterThan(0);
  });
  it('8.3.6 Recent Activities page nation should be functional, such as change page or change number per page', async () => {
    const pages = await page.$x(
      "//div[contains(@class,'UserProfile_activities')]/div/div/ul/li[contains(@class,'ant-pagination-item-active')]",
    );
    expect(pages.length).toBeGreaterThan(0);
  });
});
