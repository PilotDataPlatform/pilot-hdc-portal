/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Typography, Card, Spin, message, Empty } from 'antd';
import { getAnnouncementApi } from '../../../../APIs';
import moment from 'moment';
import i18n from '../../../../i18n';
const { Paragraph } = Typography;

export default function Recent({ currentProject, indicator }) {
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  useEffect(() => {
    setLoading(true);
    getAnnouncementApi({ projectCode: currentProject?.code })
      .then((res) => {
        const result = res?.data?.result[0];
        setAnnouncement(result);
      })
      .catch((err) => {
        message.error(
          `${i18n.t('errormessages:announcement.getAnnouncementApi.recent.0')}`,
          3,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentProject.id, indicator]);
  return (
    <Card title="Recent announcement" style={{ width: '100%' }}>
      {loading ? (
        <Spin />
      ) : announcement ? (
        <>
          <Paragraph
            style={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
              lineHeight: '16px',
              fontSize: 14,
              marginBottom: 0,
            }}
          >
            {announcement?.message || 'No Data'}
          </Paragraph>
          <span
            style={{ color: 'rgba(0, 0, 0, 0.45)', fontStyle: 'italic' }}
          >{`${announcement?.announcerUsername} - ${
            announcement?.createdAt &&
            moment(announcement.createdAt).format('MMMM Do YYYY, h:mm:ss a')
          }`}</span>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
}
