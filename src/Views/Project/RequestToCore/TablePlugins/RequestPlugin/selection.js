/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Checkbox } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export const selectionOptions = {
  renderCell: function (checked, record, index, originNode) {
    const { reviewStatus } = record;
    if (record.status.toLowerCase() === 'archived') {
      return <Checkbox disabled />;
    }
    if (reviewStatus === 'approved') {
      return <CheckOutlined style={{ color: '#5b8c00' }} />;
    }
    if (reviewStatus === 'denied') {
      return <CloseOutlined style={{ color: '#ff6d72' }} />;
    }

    return originNode;
  },
  getCheckboxProps: function (record) {
    if (
      record.status.toLowerCase() === 'archived' ||
      record.reviewStatus === 'approved' ||
      record.reviewStatus === 'denied'
    ) {
      return {
        disabled: true,
      };
    }
  },
};
