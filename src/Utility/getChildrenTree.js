/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { FolderOpenOutlined, ContainerOutlined } from '@ant-design/icons';

const getChildrenTree = (data, layer = 0, path) => {
  if (!data || data.length === 0) {
  } else {
    const res = data
      .filter((item) => typeof item !== 'string')
      .map((d) => ({
        title: Object.keys(d)[0],
        key: `${layer}-${Object.keys(d)[0]}`,
        id: Object.keys(d)[0],
        path: path + '/' + Object.keys(d)[0],
        icon: <ContainerOutlined /> && <FolderOpenOutlined />,
        children: getChildrenTree(
          d[Object.keys(d)[0]],
          layer + `-${Object.keys(d)[0]}`,
          path + '/' + Object.keys(d)[0],
        ),
        type: 'folder',
      }));
    return res;
  }
};

export default getChildrenTree;
