/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { timeout } = require('async');
const _ = require('lodash');
function catchErrorMessage(getPage, callback) {
  const page = getPage();
  page.on('console', async (msg) => {
    const consoleMsgs = await Promise.all(
      msg.args().map((arg) => arg.jsonValue()),
    );
    if (consoleMsgs[0] === 'error message logging') {
      callback(consoleMsgs);
    }
  });
}

async function checkErrorMessage(page, msg) {
  await page.waitForSelector('.ant-message .ant-message-notice', {
    timeout: 10 * 1000,
  });
  const messages = await page.$$eval(
    '.ant-message .ant-message-notice span:nth-child(2)',
    (elems) => elems.map((item) => item.textContent),
  );
  const isMsgIncluded = _.includes(messages, msg);
  return isMsgIncluded;
}

module.exports = { catchErrorMessage, checkErrorMessage };
