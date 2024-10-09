/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { disabletest } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../../e2e/config');
const { projectCode } = dataConfig.userProfile;

jest.setTimeout(700000);

describe('Project List', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
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
  async function CheckProjectExist() {
    const searchIcon = await page.waitForXPath(
      '//button//span[contains(@class, "anticon-search")]',
    );
    await searchIcon.click();
    const projectCodeInput = await page.waitForXPath(
      '//p[text()="Project Name"]//following-sibling::div//input',
    );
    await projectCodeInput.type(projectCode);
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class,"LandingPageContent_secondInputLine" )]//button[@type="submit"]',
    );
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const projectList = await page.$x('//*[@class="ant-list-items"]');
    expect(projectList.length).toBe(0);
  }
  it('1.7.9 After change project visibility “Discoverable by all platform user”, then only project member should be able to see this project', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//span[contains(text(),"Edit")]//parent::button',
    );
    await editBtn.click();

    const visibleSwitch = await page.waitForXPath(
      "//button[@aria-checked='true' and @role='switch']",
    );
    await visibleSwitch.click();

    let saveBtn = await page.waitForXPath(
      '//span[contains(text(),"Save")]//parent::button',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);

    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await page.waitForXPath("//tr[contains(@class,'ant-table')]");
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletest.length != 0) {
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
    }

    await page.waitForTimeout(3000);

    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'disabletest');
    await init(page, { closeBanners: true });

    await page.goto(`${baseUrl}projects`);

    await CheckProjectExist();
    await page.waitForTimeout(6000);

    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await page.waitForXPath("//tr[contains(@class,'ant-table')]");
    const user = await page.$x(`//tr[@data-row-key='${disabletest.username}']`);

    if (user.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(3000);

    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');

    let edit = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await edit.click();

    const invisibleSwitch = await page.waitForXPath(
      "//button[@aria-checked='false' and @role='switch']",
    );
    await invisibleSwitch.click();

    let save = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]',
    );
    await save.click();
  });
});
