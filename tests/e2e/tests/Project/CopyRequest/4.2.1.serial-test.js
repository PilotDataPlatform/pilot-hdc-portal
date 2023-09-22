/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { mailHogHost } = require('../../../config');
const { waitForRes } = require('../../../../utils/api');
jest.setTimeout(700000);
describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });
  it('4.2.1 All project admins could receive email notification with correct information including project code, username and user email', async () => {
    await page.goto(mailHogHost);
    await waitForRes(page, '/api/v2/messages');
    await page.waitForXPath(
      `//span[contains(@class, "subject") and contains(text(), "A new request to copy data")]`,
    );
  });
});
