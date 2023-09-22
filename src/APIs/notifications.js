/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { mapToNewStructure } from '../Utility/maintenance/maintenance';
import { serverAxios, serverAxiosNoIntercept } from './config';

export const getFilteredNotifications = async (username) => {
  const res = await serverAxios({
    url: `/v1/maintenance-announcements/?username=${username}`,
    method: 'GET',
    params: {
      page_size: 0,
    },
  });
  res.data.result = res.data.result.map(mapToNewStructure).sort((a, b) => {
    return (
      new Date(a.detail.maintenanceDate) - new Date(b.detail.maintenanceDate)
    );
  });
  return res;
};

export const postUnsubscribeNotifications = (username, notification_id) => {
  return serverAxios({
    url: `/v1/maintenance-announcements/${notification_id}/unsubscribe`,
    method: 'POST',
  });
};

export const createNotification = (message, detail) => {
  let duration_minutes = 0;
  if (detail.duration_unit === 'd') {
    duration_minutes = detail.duration * 24 * 60;
  }
  if (detail.duration_unit === 'h') {
    duration_minutes = detail.duration * 60;
  }
  if (detail.duration_unit === 'm') {
    duration_minutes = detail.duration;
  }
  return serverAxios({
    url: '/v1/maintenance-announcements/',
    method: 'POST',
    data: {
      message,
      effective_date: detail.maintenance_date,
      duration_minutes,
    },
  });
};

export const updateNotification = (id, message, detail) => {
  let duration_minutes = 0;
  if (detail.duration_unit === 'd') {
    duration_minutes = detail.duration * 24 * 60;
  }
  if (detail.duration_unit === 'h') {
    duration_minutes = detail.duration * 60;
  }
  if (detail.duration_unit === 'm') {
    duration_minutes = detail.duration;
  }
  return serverAxios({
    url: `/v1/maintenance-announcements/${id}`,
    method: 'PATCH',
    data: {
      message,
      effective_date: detail.maintenance_date,
      duration_minutes,
    },
  });
};

export const deleteNotification = (id) => {
  return serverAxios({
    url: `/v1/maintenance-announcements/${id}`,
    method: 'DELETE',
  });
};

export const getAllNotifications = () => {
  return serverAxios({
    url: '/v1/maintenance-announcements/?sort_by=created_at&sort_order=desc&page=1&page_size=1000',
    method: 'GET',
  });
};
