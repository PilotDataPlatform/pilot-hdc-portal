/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../utils/login.js');
const { init } = require('../../../utils/commonActions');
const { navigateToCore } = require('../../../utils/greenroomActions');
const {
  baseUrl,
  dataConfig,
  mailHogHost,
  mailHogProtocol,
} = require('../../config');
const { collaborator } = require('../../../users');
const mailhog = require('mailhog')({
  host: mailHogHost,
  protocol: mailHogProtocol,
});

jest.setTimeout(700000);

describe('Invite user into project within project members page', () => {
  let page;
  const projectCode = dataConfig.adminCanvas.projectCode;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('2.1.1 - User receive email, the role in the email matches user role in project', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    try {
      const actions = await page.waitForXPath(
        "//td[contains(text(), 'test@automation.com')]/parent::tr/td/button",
      );
      await actions.hover();
      await page.waitForTimeout(1000);
      const removeMember = await page.waitForXPath(
        "//ul[contains(@class, 'ant-dropdown')]/li[contains(text(), 'Delete')]",
      );
      await removeMember.click();
      const confirmDelete = await page.waitForXPath(
        "//div[contains(@class ,'ant-modal-confirm-btns')]/button/span[contains(text(), 'OK')]",
      );
      await confirmDelete.click();
      await page.waitForResponse(
        (response) =>
          response.url().includes('/users') &&
          response.url().includes(collaborator.username) &&
          response.status() === 200,
      );
    } catch {}

    const addMember = await page.waitForXPath(
      "//button/span[contains(text(), 'Add Member')]/parent::button",
    );
    await addMember.click();
    const collaboratorRadio = await page.waitForXPath(
      "//label[contains(@class, 'ant-radio-wrapper')]/span[contains(text(), 'Collaborator')]/preceding-sibling::span/input",
    );
    await page.evaluate((node) => node.click(), collaboratorRadio);

    const email = await page.waitForXPath("//input[contains(@id, 'email')]");
    await email.type(collaborator.email);

    const submitButton = await page.waitForXPath(
      "//button/span[contains(text(), 'Submit')]",
    );
    await submitButton.click();
    await page.waitForResponse(
      (response) =>
        response.url().includes('/users') && response.status() === 200,
    );
  });

  it('2.1.1 - After user login back to activate account, the name folder should be created in the Project File Explorer Greenroom and Core', async () => {
    await logout(page);
    const logoutUrl = new URL(await page.url());
    expect(logoutUrl.pathname === '/login').toBeTruthy();

    await login(page, 'collaborator');
    await page.waitForTimeout(2000);
    const loginUrl = new URL(await page.url());
    expect(loginUrl.pathname === '/landing').toBeTruthy();

    await page.goto(`${baseUrl}project/${projectCode}/data`);
    const greenroomBreadcrumb = await page.waitForXPath(
      `//span[contains(@class, 'ant-breadcrumb-link') and contains(text(), '${collaborator.username}')]`,
    );
    expect(greenroomBreadcrumb).toBeTruthy();

    await navigateToCore(page);
    const coreBreadcrumb = await page.waitForXPath(
      "//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(@class, 'ant-breadcrumb-link') and contains(text(), 'test')]",
    );
    expect(coreBreadcrumb).toBeTruthy();
  });
});
