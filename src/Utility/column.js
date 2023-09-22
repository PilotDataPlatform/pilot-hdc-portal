/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Popover } from 'antd';

export const partialString = (string, length, isDisplay) => {
  const partString = `${string.substring(0, length)}...`;

  if (isDisplay) {
    return (
      <Popover overlayStyle={{ maxWidth: 600, wordBreak: 'break-word' }} content={<span>{string}</span>}>
        {partString}
      </Popover>
    );
  }

  return partString;
};