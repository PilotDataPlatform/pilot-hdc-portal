/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const waitForRes = function (page, url) {
  return new Promise((resolve, reject) => {
    page.on('response', async function (response) {
      if (
        response.url().includes(url) &&
        typeof response.json !== 'undefined'
      ) {
        let resBody;
        try {
          resBody = await response.json();
        } catch (e) {}
        if (resBody) {
          resolve(resBody);
        }
      }
    });
  });
};
module.exports = {
  waitForRes,
};
