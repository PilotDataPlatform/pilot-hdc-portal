/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Heatmap, G2 } from '@ant-design/plots';
import HeatMapLegend from './HeatMapLegend';

import styles from './index.module.scss';

function HeatMap({ data, color, graphConfig, showLegend = true }) {
  G2.registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
      const group = container.addGroup();
      const attrs = {
        stroke: '#fff',
        lineWidth: 6,
        fill: cfg.color,
        path: [],
      };
      const points = cfg.points;
      const path = [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['L', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['Z'],
      ];

      attrs.path = this.parsePath(path);
      group.addShape('path', {
        attrs,
      });

      return group;
    },
  });

  const config = {
    data,
    height: 220,
    appendPadding: 3,
    autoFit: true,
    color,
    shape: 'boundary-polygon',
    yAxis: {
      grid: null,
      label: {
        style: {
          fontSize: 11
        }
      }
    },
    tooltip: false,
    xAxis: {
      position: 'top',
      tickLine: null,
      line: null,
      label: {
        offsetY: -8,
        style: {
          fontSize: 12,
          fill: '#666',
          textBaseline: 'top',
        },
      },
    },
    meta: {
      [graphConfig.xField]: {
        type: 'cat',
        values: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      [graphConfig.yField]: {
        type: 'cat',
      },
      [graphConfig.seriesField]: {
        sync: true,
      },
    },
    ...graphConfig,
  };

  return (
    <div className={styles['heatmap-container']}>
      {showLegend && <HeatMapLegend colors={color} />}
      <Heatmap {...config} />
    </div>
  );
}

export default React.memo(HeatMap);
