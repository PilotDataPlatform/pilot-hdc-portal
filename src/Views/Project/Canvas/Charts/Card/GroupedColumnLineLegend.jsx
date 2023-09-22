/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useTheme } from '../../../../../Themes/theme';
import styles from './index.module.scss';

function GroupedColumnLineLegend({ legendLabels }) {
  const { projectCanvasChart } = useTheme();
  const legendColors = [
    ...projectCanvasChart.groupedColumnLine.column,
    projectCanvasChart.groupedColumnLine.line,
  ];
  const legendColorMap = legendLabels.reduce(
    (labels, currentLabel, currentIndex) => [
      ...labels,
      { [currentLabel]: legendColors[currentIndex] },
    ],
    [],
  );

  if (!legendLabels) {
    return null;
  }

  function appendLegend() {
    return legendColorMap.map((item, index) => {
      const legendLabel = Object.keys(item)[0];
      const legendColor = item[legendLabel];
      const legendColorStyles = {
        display: 'inline-block',
        marginRight: '0.6rem',
        width: '1.4rem',
        height: index === 2 ? '0.2rem' : '1.4rem',
        borderRadius: '2px',
        backgroundColor: legendColor,
      };

      return (
        <li
          key={uuidv4()}
          className={styles['grouped-column-line__legend-item']}
        >
          <span style={legendColorStyles} />
          <span className={styles['grouped-column-line__legend-label']}>
            {legendLabel}
          </span>
        </li>
      );
    });
  }
  return (
    <ul className={styles['grouped-column-line__legend']}>{appendLegend()}</ul>
  );
}

export default GroupedColumnLineLegend;
