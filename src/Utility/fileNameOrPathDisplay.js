/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Tooltip } from 'antd';

export const fileNameOrPathDisplay = (str) => {
  if (str.length > 15) {
    return <Tooltip title={str}>{`${str.slice(0, 15)}...`}</Tooltip>;
  } else {
    return str;
  }
};

export const truncateFileName = (str, lengthLimit = 27) => {
  str = str.split('/').at(-1);
  return str.length > lengthLimit ? `...${str.slice(-lengthLimit)}` : str;
};

