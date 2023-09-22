/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { clearInput, clearSelector } = require('../../../../utils/inputBox.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('Project administrator should be able to edit project information', () => {
  let page;
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
  it('b. Project admin should be able to add tags or edit tags, each tag should not contain space', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();
    await clearSelector(page, 'form .ant-form-item .ant-select-selector');
    await page.type('form .ant-form-item .ant-select-selector', '123');
    await page.keyboard.press('Enter');
    let saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForXPath('//form//span[text()="123" and @class="ant-tag"]');
    await page.waitForTimeout(3000);
    editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();

    await page.waitForSelector('form .ant-form-item .ant-select-selector');
    await page.click('form .ant-form-item .ant-select-selector');
    await page.type(
      'form .ant-form-item .ant-select-selector',
      'test whitespace',
    );
    await page.keyboard.press('Enter');
    await page.waitForXPath(
      '//span[text()="Project tags may not contain spaces."]',
    );
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(2000);
  });
  it('c. Project admin should be able to edit project description, which should less than 250 characters and capable of handling input with enter, but description should not contain only space and new line', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();
    await page.click(
      '.ant-form .ant-form-item-control-input-content textarea',
      {
        clickCount: 3,
      },
    );
    await page.keyboard.press('Backspace');
    await page.type(
      '.ant-form .ant-form-item-control-input-content textarea',
      '  \n\n  ',
    );
    let saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(2000);

    editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button',
    );
    await editBtn.click();
    let noteInputVal = await page.evaluate(
      () =>
        document.querySelector(
          '.ant-form .ant-form-item-control-input-content textarea',
        ).value,
    );
    expect(noteInputVal).toBe('');
    const dummyText =
      'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
    await page.type(
      '.ant-form .ant-form-item-control-input-content textarea',
      dummyText,
    );

    noteInputVal = await page.evaluate(
      () =>
        document.querySelector(
          '.ant-form .ant-form-item-control-input-content textarea',
        ).value,
    );
    expect(noteInputVal).toBe(dummyText.slice(0, 250));
    saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]//parent::button',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);
  });
  it('d. When project description contains long string with/without white space, it could wrap the description within card length on landing page and <=250 characters', async () => {
    await page.goto(`${baseUrl}projects`);
    const searchIcon = await page.waitForXPath(
      '//button//span[contains(@class, "anticon-search")]',
    );
    await searchIcon.click();
    const projectCodeInput = await page.waitForXPath(
      '//p[text()="Project Code"]//following-sibling::div//input',
    );
    await projectCodeInput.type(projectCode);
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class,"LandingPageContent_secondInputLine" )]//button[@type="submit"]',
    );
    await searchBtn.click();
    await page.waitForTimeout(3000);
    const dropIcon = await page.waitForXPath(
      '//span[contains(@class,"anticon-down-circle")]',
    );
    await dropIcon.click();
    await page.waitForTimeout(3000);
    const { height, length } = await page.evaluate(() => {
      const node = document.querySelector('.ant-typography div:nth-child(2) p');
      return {
        height: node.clientHeight,
        length: node.textContent.length,
      };
    });
    expect(height).toBeGreaterThan(20);
    expect(length).toBeLessThan(251);
  });
  it('e. After saved editing, the space in the beginning of the project name should be automatically removed', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    const editBtn = await page.waitForXPath(
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
    let nextName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    while (nextName === previousName) {
      nextName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    }
    await page.click(
      '.ant-form .ant-form-item-control-input > .ant-form-item-control-input-content input[type="text"]',
      {
        clickCount: 3,
      },
    );
    await page.keyboard.press('Backspace');
    await nameInput.type(nextName);
    const saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-extra-content")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);
    const changedName = await page.waitForXPath(
      '//span[@class="ant-page-header-heading-title"]//div//div//span',
    );
    const changedNameTxt = await page.evaluate(
      (node) => node.textContent,
      changedName,
    );
    expect(changedNameTxt).toBe(nextName);
  });
});
