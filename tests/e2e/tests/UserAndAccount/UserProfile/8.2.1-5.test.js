/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { disabletest } = require('../../../../users');
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
    const userInput = await page.waitForXPath(`//input[@id='email']`);
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
    await page.waitForTimeout(2000);
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
  it("8.2.1 Platform admin could see all users' profile in the User Management ", async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForTimeout(3000);
    await findDisabletestUser();

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletest.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(6000);

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
      "//li[contains(@class,'ant-dropdown-menu-item') and  contains(span,'Profile')]",
    );
    await profileBtn.click();

    const profileModal = await page.waitForXPath(
      "//div[@class='ant-modal-title' and text()='Profile']",
    );
    expect(profileModal).not.toBe(null);
  });
  it('8.2.2 Member profile should have 3 main sections: Member Information, Project Membership and Recent Activities ', async () => {
    const memberInfo = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Member Profile']",
    );
    expect(memberInfo).not.toBe(null);

    const projectMembership = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Project Membership']",
    );
    expect(projectMembership).not.toBe(null);

    const recentActivities = await page.$x(
      "//div[@class='ant-card-head-title' and text()='Recent Activities']",
    );
    expect(recentActivities).not.toBe(null);
  });

  it('8.2.3 User Information should contain following fields:Username,First Name,Last Name,Email,Join Date,Last login,Account status', async () => {
    await page.waitForXPath(
      '//ul[contains(@class, "UserProfile_member__content")]//span[text()="Username"]//following-sibling::span',
    );
    await page.waitForTimeout(1000);

    let fields = [
      'Username',
      'First Name',
      'Last Name',
      'Join Date',
      'Email',
      'Last Login',
    ];
    let field;
    fields.forEach(async (e) => {
      field = await page.waitForXPath(
        `//ul[contains(@class, 'UserProfile_member__content')]//span[text()='${e}']//following-sibling::span`,
      );
      expect(field).not.toBe(null);
      await page.waitForTimeout(1000);
    });

    const accountStatus = await page.waitForXPath(
      "//div[@class='ant-card-extra']/span[contains(@class,'UserProfile_member__account-status--active') and text()='Account Status: ']/span",
    );
    expect(accountStatus).not.toBe(null);
  });

  it('8.2.4 Project membership should contain all the projects the platform user in with following information:Project name,Project code,User role', async () => {
    const projectName = await page.waitForXPath(
      "//h4[@class='ant-list-item-meta-title']",
    );

    const projectNames = await page.$x(
      "//h4[@class='ant-list-item-meta-title']",
    );
    expect(projectNames.length).toBeGreaterThan(0);

    const projectCodes = await page.$x(
      "//div[@class='ant-list-item-meta-description']/p/strong[contains(text(),'Project')]",
    );
    const codeText = await projectCodes[0].evaluate((el) => el.textContent);
    expect(codeText.length).toBeGreaterThan(9);

    const projectRoles = await page.$x(
      "//div[@class='ant-list-item-meta-description']/p[contains(text(),'role')]",
    );
    const roleText = await projectRoles[0].evaluate((el) => el.textContent);

    expect(roleText.split('/')[1].length).toBeGreaterThan(15);
  });
  it('8.2.5 Recent Activities: All projects,Date,Action ', async () => {
    const date = await page.waitForXPath(
      "//div[@class='ant-col']/span[text()='Date']",
    );
    expect(date).not.toBe(null);

    await page.waitForXPath(
      "//li[contains(@class,'activities-log')]/div/div/span",
    );
    const dateLog = await page.$x(
      "//li[contains(@class,'activities-log')]/div/div/span",
    );
    const dateValue = await dateLog[0].evaluate((el) => el.textContent);
    var format = false;
    var myRegExp =
      /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    if (dateValue.match(myRegExp)) {
      format = true;
    }
    expect(format).toBe(true);

    const actionIcon = await page.$x(
      "//div[contains(@class,'activity-item__action')]/div/div/div/span[@role='img']",
    );
    expect(actionIcon.length).toBeGreaterThan(0);
  });
});
