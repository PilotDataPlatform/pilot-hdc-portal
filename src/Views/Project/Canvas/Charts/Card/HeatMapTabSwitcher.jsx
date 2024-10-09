/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useMemo } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { TabSwitcher } from '../../../Components/TabSwitcher';
import HeatMap from './HeatMap';
import { useTheme } from '../../../../../Themes/theme';

const DOWNLOAD = 'downloads';
const UPLOAD = 'upload';
const DELETE = 'deletion';
const COPY = 'copy';

function HeatMapTabSwitcher({
  downloadData,
  uploadData,
  deleteData,
  copyData,
  dataMapping,
  role,
}) {
  const { projectCanvasChart } = useTheme();
  const activityColorMap = {
    [DOWNLOAD]: projectCanvasChart.heatgraph.range.green,
    [UPLOAD]: projectCanvasChart.heatgraph.range.blue,
    [DELETE]: projectCanvasChart.heatgraph.range.red,
    [COPY]: projectCanvasChart.heatgraph.range.orange,
  };
  const tabColorMap = {
    [DOWNLOAD]: activityColorMap[DOWNLOAD][1],
    [UPLOAD]: activityColorMap[UPLOAD][1],
    [DELETE]: activityColorMap[DELETE][1],
    [COPY]: activityColorMap[COPY][1],
  };
  const weeks = downloadData.reduce(
    (allWeeks, data) => [...allWeeks, data.week],
    [],
  );
  let startingWeek = downloadData.length && Math.min(...weeks);

  const formatterMapping = weeks.reduce((savedWeeks, week) => {
    if ((week - startingWeek) % 4 === 0) {
      const startOfWeekMonth = moment(week, 'w').format('MMM');
      const endOfWeekMonth = moment(week, 'w').endOf('week').format('MMM');

      if (startOfWeekMonth !== endOfWeekMonth) {
        startingWeek += 1;
        return savedWeeks;
      }

      const isWeekSaved = savedWeeks.find((item) => item.week === week);
      if (!isWeekSaved) {
        savedWeeks.push({ week, month: startOfWeekMonth });
      }
    }

    return savedWeeks;
  }, []);

  const graphConfig = {
    ...dataMapping,
    reflect: 'y',
    shape: 'boundary-polygon',
    meta: {
      day: {
        type: 'cat',
        values: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      week: {
        type: 'cat',
      },
      commits: {
        sync: true,
      },
    },
    yAxis: {
      grid: null,
    },
    tooltip: {
      title: 'date',
      formatter: (datum) => {
        return { name: 'Total', value: datum.frequency };
      },
    },
    xAxis: {
      position: 'bottom',
      tickLine: null,
      line: null,
      label: {
        offsetY: -8,
        style: {
          fontSize: 10,
          fill: '#666',
          textBaseline: 'top',
        },
        formatter: (val) => {
          const validWeek = formatterMapping.find(
            (value) => value.week === val,
          );

          if (validWeek) {
            return validWeek.month;
          }
        },
      },
    },
  };

  const heatMapGraphs = useMemo(
    () => ({
      [DOWNLOAD]: (
        <HeatMap
          data={downloadData}
          color={activityColorMap[DOWNLOAD]}
          graphConfig={graphConfig}
        />
      ),
      [UPLOAD]: (
        <HeatMap
          data={uploadData}
          color={activityColorMap[UPLOAD]}
          graphConfig={graphConfig}
        />
      ),
      [DELETE]: (
        <HeatMap
          data={deleteData}
          color={activityColorMap[DELETE]}
          graphConfig={graphConfig}
        />
      ),
      ...(role && {
        [COPY]: (
          <HeatMap
            data={copyData}
            color={activityColorMap[COPY]}
            graphConfig={graphConfig}
          />
        ),
      }),
    }),
    [downloadData, uploadData, deleteData, copyData],
  );

  return <TabSwitcher contentMap={heatMapGraphs} colorMap={tabColorMap} />;
}

export default React.memo(HeatMapTabSwitcher, (prevProps, nextProps) =>
  _.isEqual(prevProps, nextProps),
);
