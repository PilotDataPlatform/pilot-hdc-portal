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
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('1. Project member first time click Guacamole icon, make the request to access', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(3000);
    let guacamoleBtn = await page.waitForXPath(
      '//span[text()="Guacamole"]//ancestor::li',
    );
    await guacamoleBtn.click();
    const reqAccess = await page.waitForXPath(`//div[text()="Request Access"]`);
    expect(reqAccess).not.toBe(null);
    await page.waitForTimeout(2000);
  });
  it('2. Users should be able to provide a message along with the request as Optional input.', async () => {
    const reqAccess = await page.waitForXPath(
      `//span[contains(text(), "Send Request")]//parent::button`,
    );
    let v = await page.evaluate(
      (element) => element.getAttribute('disabled'),
      reqAccess,
    );
    expect(v).toBe(null);
  });
  it('3. Message box specification: 100 characters max.', async () => {
    const dummyText =
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. magnis dis parturient montes.';
    await page.type(
      '.ant-modal-body .ant-input-textarea-show-count textarea',
      dummyText,
    );
    const noteInputVal = await page.evaluate(
      () =>
        document.querySelector(
          '.ant-modal-body .ant-input-textarea-show-count textarea',
        ).value,
    );
    expect(noteInputVal).toBe(dummyText.slice(0, 100));
    await page.waitForTimeout(2000);
    await page.click('.ant-modal-content .ant-modal-close');
    await page.waitForTimeout(2000);
  });
});
