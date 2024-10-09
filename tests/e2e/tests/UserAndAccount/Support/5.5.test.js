/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { login, logout } = require('../../../../utils/login.js');
const {
  init,
  openSupportDrawer,
  openAndWaitForTarget,
} = require('../../../../utils/commonActions.js');
const { clearInput } = require('../../../../utils/inputBox.js');
const { collaborator } = require('../../../../users');
const { waitForRes } = require('../../../../utils/api');
const { baseUrl, mailHogHost, mailHogAdminEmail } = require('../../../config');

describe('5.5 Test Contact us form should receive an email confirmation', () => {
  let page;
  jest.setTimeout(10000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
  });

  it('Username and email prefilled, user should receive email confirmation', async () => {
    const title = 'Test inquiry';
    const description = 'This is the test body';

    await openSupportDrawer(page);
    const usernameInput = await page.$eval('#name', (input) => input.value);
    const emailInput = await page.$eval('#email', (input) => input.value);

    expect(usernameInput).toBe(collaborator.username);
    expect(emailInput.replace(/\+/g, '')).toBe(collaborator.email);

    await page.type('#title', title);
    await page.type('#description', description);
    const submitButton = await page.waitForXPath(
      '//div[contains(@class, "ant-drawer-body")]/descendant::span[contains(text(), "Submit")]/parent::button',
    );
    await submitButton.click();

    await page.waitForResponse(
      (response) =>
        response.status() === 200 && response.url().includes('/v1/contact'),
    );

    await page.goto(mailHogHost);
    await waitForRes(page, '/api/v2/messages');
    const userEmail = await page.waitForXPath(
      `//span[contains(@class, "subject") and contains(text(), "Confirmation of Contact Email")]//ancestor::div[contains(@class, "msglist-message")]//div[contains(@ng-repeat, "To")]`,
    );
    const userEmailTxt = await page.evaluate((node) => {
      return node.innerText;
    }, userEmail);
    expect(userEmailTxt).toBe(collaborator.email);
    const adminEmail = await page.waitForXPath(
      `//span[contains(@class, "subject") and contains(text(), "Support Request Submitted")]//ancestor::div[contains(@class, "msglist-message")]//div[position()=1]`,
    );
    const adminEmailTxt = await page.evaluate((node) => {
      return node.innerText;
    }, adminEmail);
    console.log(adminEmailTxt.toString());
    expect(adminEmailTxt.toString()).toBe(mailHogAdminEmail);
  });

  it('Contact us form description is limited between 10 to 10,000 characters, display error message if any information is incorrect', async () => {
    await page.goto(`${baseUrl}landing`);
    const charErrorMessage =
      'The description must be between 10 and 1000 characters';
    const descErrorMessage = 'Please provide a description';

    let upperLimitChar = '';
    for (let i = 0; i < 1001; i++) {
      upperLimitChar += 'a';
    }
    const lowerLimitChar = 'aaa';
    const withinLimitChar = 'aaaaaaaaaaa';
    const inputChars = [upperLimitChar, lowerLimitChar, withinLimitChar];

    await openSupportDrawer(page);

    for (let char of inputChars) {
      await page.type('#description', char);
      let charErrorLabel;
      try {
        charErrorLabel = await page.waitForXPath(
          `//div[contains(@class, "ant-drawer-body")]/descendant::div[contains(text(), '${charErrorMessage}')]`,
          { timeout: 2500 },
        );
      } catch {}
      if (char.length > 1000 || char.length < 10) {
        expect(charErrorLabel).toBeTruthy();
      } else {
        expect(charErrorLabel).toBeFalsy();
      }

      await clearInput(page, '#description');
      const descErrorLabel = await page.waitForXPath(
        `//div[contains(@class, "ant-drawer-body")]/descendant::div[contains(text(), '${descErrorMessage}')]`,
      );
      expect(descErrorLabel).toBeTruthy();
    }
  });

  it('Description message should not contain only space and line breaks', async () => {
    await page.goto(`${baseUrl}landing`);
    const invalidChars = '     \n\n    \n  ';
    const charErrorMessage =
      'The description must be between 10 and 1000 characters';

    await openSupportDrawer(page);
    await page.type('#description', invalidChars);

    const charErrorLabel = await page.waitForXPath(
      `//div[contains(@class, "ant-drawer-body")]/descendant::div[contains(text(), '${charErrorMessage}')]`,
      { timeout: 2500 },
    );
    expect(charErrorLabel).toBeTruthy();
  });

  it('Documentation should redirect user to xwiki user guide page', async () => {
    await openSupportDrawer(page);

    const wikiLink = await page.waitForXPath(
      '//div[contains(@class, "ant-drawer-body")]/descendant::button/a[contains(text(), "User Guide")]',
    );
    const newPage = await openAndWaitForTarget(browser, page, wikiLink);

    expect(newPage.url().includes('/xwiki/wiki/')).toBeTruthy();
    await newPage.close();
  });
});
