/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.userProfile;
jest.setTimeout(700000);

describe('Project List', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 3000, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('2.4.2 Numbers of admins, contributors, collaborators matches the number in the members page. ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[@aria-label='down-circle']",
    );
    const downBtn = await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[@aria-label='down-circle']",
    );
    await downBtn.click();
    await page.waitForTimeout(2000);
    await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[text()='Administrators']//following-sibling::span",
    );
    const admin_display = await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[text()='Administrators']//following-sibling::span",
    );
    const adminNum = await page.evaluate((el) => el.textContent, admin_display);

    const contribute_display = await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[text()='Contributors']//following-sibling::span",
    );
    const contributeNum = await page.evaluate(
      (el) => el.textContent,
      contribute_display,
    );

    const collaborator_display = await page.waitForXPath(
      "//div[@class='ant-row']/main[@class='ant-layout-content']//span[text()='Collaborators']//following-sibling::span",
    );
    const collaboratorNum = await page.evaluate(
      (el) => el.textContent,
      collaborator_display,
    );
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");

    const admin = await page.$x("//td[text()='Project Administrator']");
    expect(admin.length.toString()).toBe(adminNum);

    const contributors = await page.$x("//td[text()='Project Contributors']");
    expect(contributors.length.toString()).toBe(contributeNum);

    const collaborators = await page.$x("//td[text()='Project Collaborator']");
    expect(collaborators.length.toString()).toBe(collaboratorNum);
  });
});
