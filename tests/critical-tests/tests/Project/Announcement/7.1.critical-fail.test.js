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
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('7.1', () => {
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
  it('7.1 Only project administrator/ platform administrator could publish announcement', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    const announcementContent = await page.waitForXPath(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementContent).not.toBe(null);
    await logout(page);
    await page.waitForTimeout(3000);

    await login(page, 'collaborator');
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    await page.waitForTimeout(3000);
    const announcementCollaboratorContent = await page.$x(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementCollaboratorContent.length).toBe(0);
    await logout(page);
    await page.waitForTimeout(3000);

    await login(page, 'contributor');
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    await page.waitForTimeout(3000);
    const announcementContributorContent = await page.$x(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementContributorContent.length).toBe(0);
  });
});
