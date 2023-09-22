/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { serverAxios } from './config';

function getUserFavourites({ page, page_size }) {
  return serverAxios({
    url: `/v1/favourites`,
    params: { page, page_size },
  });
}

function addUserFavourite({ id, user, type, container_code, zone }) {
  return serverAxios({
    url: `/v1/favourite`,
    method: 'POST',
    data: { id, user, type, container_code, zone },
  });
}

function deleteUserFavourite({ id, user, type }) {
  return serverAxios({
    url: `/v1/favourite`,
    method: 'DELETE',
    params: { id, user, type },
  });
}

function deleteBatchUserFavourites(data) {
  return serverAxios({
    url: `/v1/favourites`,
    method: 'DELETE',
    data,
  });
}

function updateUserPin({ id, user, type, pinned }) {
  return serverAxios({
    url: `/v1/favourite`,
    method: 'PATCH',
    params: { id, user, type, pinned },
  });
}

function updateBatchUserPin(data) {
  return serverAxios({
    url: `/v1/favourites`,
    method: 'PATCH',
    data,
  });
}

export {
  getUserFavourites,
  addUserFavourite,
  deleteUserFavourite,
  deleteBatchUserFavourites,
  updateUserPin,
  updateBatchUserPin,
};
