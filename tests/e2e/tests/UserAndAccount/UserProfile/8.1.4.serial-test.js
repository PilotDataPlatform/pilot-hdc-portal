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
  it('8.1.4 Project membership should contain all the projects the platform user in with following information:Project name,Project code,User role,Invited by ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await findDisabletestUser();

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletest.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(2000);

    await logout(page);
    await page.waitForTimeout(6000);
    await login(page, 'disabletest');
    await init(page, { closeBanners: true });

    await page.goto(`${baseUrl}user-profile`);

    const projects = await page.waitForXPath("//li[@class='ant-list-item']");
    await page.waitForTimeout(2000);

    const projectName = await page.$x(
      "//h4[@class='ant-list-item-meta-title']",
    );
    expect(projectName.length).toBeGreaterThan(0);

    const projectCodeTxt = await page.$x(
      "//strong[contains(text(),'Project: ')]",
    );
    const codeText = await projectCodeTxt[0].evaluate((el) => el.textContent);
    expect(codeText.length).toBeGreaterThan(9);

    const userRole = await page.$x("//p[contains(text(),'role')]");
    const roleText = await userRole[0].evaluate((el) => el.textContent);

    expect(roleText.split('/')[1].length).toBeGreaterThan(15);
  });
});
