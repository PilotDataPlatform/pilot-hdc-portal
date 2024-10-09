/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { clearInput, clearSelector } = require('../../../../utils/inputBox.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.guacamole;
jest.setTimeout(700000);

describe('Guacamole', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1520, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('1. Project Admins receive new Guacamole VM access request ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await page.waitForTimeout(3000);
    let guacamoleTab = await page.waitForXPath(
      '//div[@class="ant-tabs-tab"]//div[text()="Guacamole VM Request"]',
    );
    await guacamoleTab.click();
    await page.waitForTimeout(3000);
    const firstRow = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-tabpane-active")]//tbody[@class="ant-table-tbody"]//tr',
    );
    const { name, email, reqDate } = await page.evaluate((elem) => {
      return {
        name: elem.children[0].innerText,
        email: elem.children[1].innerText,
        reqDate: elem.children[2].innerText,
      };
    }, firstRow);
    expect(email).toBeTruthy();
    expect(name).toBeTruthy();
    expect(reqDate).toBeTruthy();
  });
  it('2. Project Admins click button to approve and select the available VM connection(s) that already configured with the Project.', async () => {
    const vmListBtn = await page.waitForXPath(
      '//span[text()="Select VM"]//parent::div',
    );
    await vmListBtn.click();
    await page.waitForTimeout(2000);
    const vmList = await page.$x('//div[@class="ant-checkbox-group"]//label');
    expect(vmList.length).toBeGreaterThan(0);
    await vmListBtn.click();
  });
  it('3. Click save, the selected VM connections will be granted to the requester, the request is “Completed”, the granted VM connections will be listed. The requester will receive email notification.', async () => {
    await page.waitForTimeout(2000);
    const existVMReq = await page.$x(
      '//span[text()="Complete"]//parent::button[@disabled]',
    );
    if (existVMReq.length > 0) {
      const name = await page.evaluate((elem) => {
        const row = elem.closest('tr');
        return row.children[0].innerText;
      }, existVMReq[0]);
      const vmListBtn = await page.waitForXPath(
        `//td[text()="${name}"]//parent::tr//td//span[text()="Select VM"]//parent::div`,
      );
      await vmListBtn.click();
      const vmList = await page.$x('//div[@class="ant-checkbox-group"]//label');
      await vmList[0].click();
      await page.waitForTimeout(2000);
      const confirmVmBtn = await page.waitForXPath(
        `//span[text()="Confirm Selection"]//parent::button`,
      );
      await confirmVmBtn.click();
      await page.waitForTimeout(3000);
      const completeBtn = await page.waitForXPath(
        `//td[text()="${name}"]//parent::tr//td//span[text()="Complete"]//parent::button`,
      );
      await completeBtn.click();
      await page.waitForTimeout(4000);
      const completedStatus = await page.waitForXPath(
        `//td[text()="${name}"]//parent::tr//td//span[text()="Completed"]`,
      );
      expect(completedStatus).toBeTruthy();
    }
  });
});
