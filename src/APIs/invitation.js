/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { setupServerAxios } from './config';
const axiosUrl = process.env.REACT_APP_API_PATH.split('/portal')[0];

const invitationAxios = setupServerAxios(axiosUrl);

function UserSelfRegistrationAPI(
  hash,
  { username, firstName, lastName, password },
) {
  return invitationAxios({
    url: `/register/invitation/${hash}`,
    method: 'POST',
    data: { username, first_name: firstName, last_name: lastName, password },
  });
}

function GetUserInviteHashAPI(hash) {
  return invitationAxios({
    url: `/register/invitation/${hash}`,
  });
}

export { UserSelfRegistrationAPI, GetUserInviteHashAPI };
