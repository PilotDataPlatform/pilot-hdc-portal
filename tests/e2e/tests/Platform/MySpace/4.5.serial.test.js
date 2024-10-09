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
jest.setTimeout(700000);
const { projectCode } = dataConfig.adminCanvas;

const {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  copyExistFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');
const {
  deleteAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
const {
  ExplorerActions,
} = require('../../../../../src/Views/Dataset/DatasetData/Components/ExplorerActions/ExplorerActions.jsx');

describe('Newsfeed ', () => {
  let perRole;
  let curRole;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findUserInTeam(user) {
    const searchUserBtn = await page.waitForXPath("//span[@role='button']");
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type(user);
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']/div/div/div/button[contains(@class,'ant-btn ant-btn-primary')]",
    );
    await searchBtn.click();

    await page.waitForTimeout(3000);
  }

  async function addMember(email) {
    const add_member = await page.waitForXPath(
      "//button[span[text()='Add Member']]",
    );
    await add_member.click();
    const userInput = await page.waitForXPath(`//input[@id='email']`);
    await userInput.type(email);
    const submitBtn = await page.waitForXPath(
      "//button[span[text()='Submit']]",
    );
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }
  it('perpare for role in teams', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    findUserInTeam(collaborator.username);

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const user = await page.$x(
      `//tr[@data-row-key='${collaborator.username}']`,
    );

    if (user[0].length === 0) {
      await addMember(collaborator.email);
      await page.waitForTimeout(6000);
      findUserInTeam(collaborator.username);
    }

    await page.waitForTimeout(2000);

    changeRoleBtn = await page.waitForXPath(
      "//a[contains(@class,'ant-dropdown') and text()='Change role ']",
    );
    await changeRoleBtn.click();

    role = await page.waitForXPath(
      "//li[@class='ant-dropdown-menu-item ant-dropdown-menu-item-only-child' and @aria-disabled='false' ][1]",
    );
    curRole = await role.evaluate((el) => el.textContent);

    pre = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item-only-child') and @aria-disabled='true' ]",
    );
    perRole = await pre.evaluate((el) => el.textContent);

    await role.click();
    okBtn = await page.waitForXPath(
      "//div[@class='ant-modal-confirm-btns']/button[span[text()='OK']]",
    );
    await okBtn.click();
  });
  it('4.5 My Project role change/updates', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/landing`);
    await page.waitForTimeout(3000);

    let roleNotification = await page.waitForXPath(
      `//span[contains(@class,'MySpace_newsfeed-item__right-time') and text()='${curRole}']//span[contains(text(),'to')]//following-sibling::span//b[text()='${projectCode}']`,
    );
    expect(roleNotification).not.toBe(null);
  });
});
