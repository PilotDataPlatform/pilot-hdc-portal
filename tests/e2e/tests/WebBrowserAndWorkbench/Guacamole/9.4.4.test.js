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
  it('4. Only platform or project admin should be able to see the table of guacamole resource request, project collaborator and contributor should not be able to see the table', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await page.waitForTimeout(3000);
    let guacamoleTab = await page.waitForXPath(
      '//div[@class="ant-tabs-tab"]//div[text()="Guacamole VM Request"]',
    );
    expect(guacamoleTab).not.toBe(null);
    await page.waitForTimeout(2000);
    await logout(page);
    await page.waitForTimeout(3000);
    await login(page, 'collaborator');
    await page.goto(`${baseUrl}project/${projectCode}/request`);
    await page.waitForTimeout(2000);
    let colabGuacamoleTab = await page.$x(
      '//div[@class="ant-tabs-tab"]//div[text()="Guacamole VM Request"]',
    );
    expect(colabGuacamoleTab.length).toBe(0);
  });
});
