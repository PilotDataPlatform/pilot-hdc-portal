/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../utils/login.js');
const { init } = require('../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('WorkBench', () => {
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
  it('prepare project to be guacomole ready', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForTimeout(3000);
    const workbenchTab = await page.waitForXPath('//div[text()="Workbench"]');
    await workbenchTab.click();
    await page.waitForTimeout(3000);
    const guacamoleDeploy = await page.$x(
      '//span[text()="Guacamole"]/parent::div/following-sibling::div//span[text()="Deploy"]/parent::button',
    );
    if (guacamoleDeploy && guacamoleDeploy.length) {
      await guacamoleDeploy[0].click();
      const confirmBtn = await page.waitForXPath(
        '//div[@class="ant-modal-body"]//span[text()="Confirm"]/parent::button',
      );
      await confirmBtn.click();
    }
  });
  it('12.1.1 Project member who has no access yet click on icon of Guacamole and Superset on the side-bar should pop up service request modal', async () => {
    await logout(page);
    await login(page, 'collaborator');

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(5 * 1000);
    const guacamoleLink = await page.waitForXPath(
      '//ul//span[text()="Guacamole"]//ancestor::li[contains(@class, "ant-menu-item")]',
    );
    await guacamoleLink.click();
    const sendReqBtn = await page.waitForXPath(
      '//span[contains(text(), " Send Request")]//parent::button',
    );
    expect(sendReqBtn).toBeTruthy();
  });
});
