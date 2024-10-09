/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

function HeatMapLegend({ colors }) {
  if (!colors) {
    return null;
  }

  return (
    <ul className={styles['heatmap-legend']}>
      <li>Less</li>
      {colors.map((color) => (
        <li
          key={uuidv4()}
          className={styles['heatmap-legend__color']}
          style={{ backgroundColor: color }}
        />
      ))}
      <li>More</li>
    </ul>
  );
}

export default HeatMapLegend;
