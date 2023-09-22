/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Popover } from 'antd';

export const convertLargeNumToAbbreviated = (num) => {
  var newValue = num;
  if (num >= 10000) {
    var suffixes = ['', 'K', 'M', 'B', 'T'];
    var suffixNum = Math.floor(('' + num).length / 4);

    var shortValue = '';
    for (var precision = 3; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0 ? num / Math.pow(10000, suffixNum) : num).toPrecision(
          precision,
        ),
      );

      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 3) {
        break;
      }
    }

    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(2);
    newValue = shortValue + suffixes[suffixNum];
  }

  return newValue;
};
