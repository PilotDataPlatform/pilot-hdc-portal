/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { clearInput, clearSelector } = require('../../../../utils/inputBox');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('click cancel button', () => {
  let page;
  let newName;
  const newTag = 'test';
  const newDescription = 'dummy text';
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1520, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function testDisplayInfo() {
    const projectNameNode = await page.waitForXPath(
      '//form//div[position()=1]//div[@class="ant-form-item-control-input"]//p',
    );
    const projectName = await page.evaluate((node) => {
      return node.textContent;
    }, projectNameNode);
    expect(projectName).not.toBe(newName);
    const tagNode = await page.$x(
      `//span[text()="${newTag}" and @class="ant-tag"]`,
    );
    expect(tagNode.length).toBe(0);
    const projectDesNode = await page.waitForXPath(
      '//form//div[position()=4]//div[@class="ant-form-item-control-input"]//p',
    );
    const projectDes = await page.evaluate((node) => {
      return node.textContent;
    }, projectDesNode);
    expect(projectDes).not.toBe(newDescription);
  }
  async function testInputInfo() {
    const editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();
    const nameInputNode = await page.waitForXPath(
      '//form[contains(@class, "Settings_custom_general_info_form")]//div[position()=1]//input',
    );
    const nameInput = await page.evaluate((node) => {
      return node.value;
    }, nameInputNode);
    expect(nameInput).not.toBe(newName);
    const tagNode = await page.$x(
      `//span[text()="${newTag}" and @class="ant-tag"]`,
    );
    expect(tagNode.length).toBe(0);
    const projectDesNode = await page.waitForXPath(
      '//form[contains(@class, "Settings_custom_general_info_form")]//div[position()=4]//textarea',
    );
    const projectDes = await page.evaluate((node) => {
      return node.textContent;
    }, projectDesNode);
    expect(projectDes).not.toBe(newDescription);
  }
  it('click cancel button, the description should not be saved, the tag should not be saved, the project name should not be saved, any previous error message should not be displayed again', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();

    const nameInput = await page.waitForXPath(
      '//form[contains(@class, "Settings_custom_general_info_form")]//div[contains(@class, "ant-form-item") and position()=1]//input',
    );
    const previousName = await page.evaluate((nameInput) => {
      return nameInput.value;
    }, nameInput);
    await clearInput(
      page,
      'form > div > .ant-row .ant-form-item-control-input-content input',
    );
    let newName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    while (newName === previousName) {
      newName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    }
    await page.click(
      '.ant-form .ant-form-item-control-input > .ant-form-item-control-input-content input[type="text"]',
      {
        clickCount: 3,
      },
    );
    await page.keyboard.press('Backspace');
    await nameInput.type(newName);
    await clearSelector(page, 'form .ant-form-item .ant-select-selector');
    await page.type('form .ant-form-item .ant-select-selector', newTag);
    await page.click('.ant-form-item-control-input-content textarea', {
      clickCount: 3,
    });
    await page.keyboard.press('Backspace');
    await page.type(
      '.ant-form-item-control-input-content textarea',
      newDescription,
    );
    const cancelBtn = await page.waitForXPath(
      '//button//span[text()="Cancel"]',
    );
    await cancelBtn.click();

    await testDisplayInfo();
    await testInputInfo();
  });
});
