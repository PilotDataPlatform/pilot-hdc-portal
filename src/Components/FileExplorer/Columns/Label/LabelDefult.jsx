/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
export default function LabelDefault({ text, record }) {
  if (record?.nodeLabel?.includes('Folder')) {
    return <FolderOutlined style={{ float: 'right' }} />;
  } else {
    return <FileOutlined style={{ float: 'right' }} />;
  }
}
