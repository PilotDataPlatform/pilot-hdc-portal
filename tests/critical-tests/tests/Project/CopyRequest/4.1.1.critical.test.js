/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { checkFile } = require('../../../../utils/copyReqActions.js');
const projectCode = dataConfig.copyReq.projectCode;
jest.setTimeout(700000);

describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('4.1.1 project collaborator will have a button for requesting copy request', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    checkFile(page);
    const copyToRequestBtn = await page.waitForXPath(
      '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
    );
    const text = await page.evaluate(
      (element) => element.textContent,
      copyToRequestBtn,
    );
    expect(text).toBe('Request to Core');
    await page.waitForTimeout(4000);
  });
});
