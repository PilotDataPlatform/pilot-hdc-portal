/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import _ from 'lodash'
import { Area } from '@ant-design/plots';

const StackedAreaPlot = function ({
  data,
  xField,
  yField,
  seriesField,
  color,
  chartConfig,
}) {
  const config = {
    data,
    xField,
    yField,
    seriesField,
    color,
    height: 220,
    padding: [40, 40, 40, 50],
    legend: {
      offsetX: 30,
    },
    ...chartConfig,
  };

  return <Area {...config} />;
};

export default React.memo(StackedAreaPlot, (prevProps, nextProps) =>
  _.isEqual(prevProps, nextProps),
);
