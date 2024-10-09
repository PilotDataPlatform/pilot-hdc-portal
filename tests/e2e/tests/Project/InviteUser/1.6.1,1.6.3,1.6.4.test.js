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

const projectCode = dataConfig.adminCanvas.projectCode;

describe('Project administrator should be able to invite user', () => {
  let page;
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
  it('members button on the sidebar', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    const icon = await page.waitForXPath(
      `//ul[@id="side-bar"]/li//span[contains(text(), "Members")]`,
    );
    expect(icon).toBeTruthy();
  });

  it(`add user modal can only be close by clicking on close icon or cancel button`, async () => {
    const button = await page.waitForXPath(
      `//span[contains(text(), "Add Member")]//parent::button`,
    );
    await button.click();
    await page.waitForTimeout(3000);
    const modalTitle = await page.waitForXPath(
      `//div[@class="ant-modal-title" and contains(text(), "Add a member")]`,
    );
    expect(modalTitle).not.toBeNull();
    const cancel = await page.waitForSelector(`#add-member-cancel-button`);
    await cancel.click();
    const isModalHidden = await page.$eval(
      '.ant-modal-root > div.ant-modal-wrap',
      (elem) => {
        return elem.style.display === 'none';
      },
    );
    expect(isModalHidden).toBeTruthy();
  });
});
