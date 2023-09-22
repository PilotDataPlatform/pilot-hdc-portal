/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { serverAxios as axios } from './config';

function sendEmailToAll(subject, messageBody) {
  return axios({
    url: '/v1/email',
    method: 'POST',
    timeout: 100 * 1000,
    data: {
      subject: subject,
      send_to_all_active: true,
      message_body: messageBody,
    },
  });
}

function sendEmails(subject, messageBody, emails) {
  return axios({
    url: '/v1/email',
    method: 'POST',
    timeout: 100 * 1000,
    data: {
      subject: subject,
      send_to_all_active: false,
      message_body: messageBody,
      emails: emails,
    },
  });
}
export { sendEmailToAll, sendEmails };
