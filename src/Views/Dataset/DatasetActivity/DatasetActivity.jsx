/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, DatePicker } from 'antd';
import {
  timeConvertWithOffestValue,
  CalTimeDiff,
} from '../../../Utility/timeCovert';
import 'antd/dist/antd.css';
import moment from 'moment';
import { DatasetCard as Card } from '../Components/DatasetCard/DatasetCard';
import DatasetActivityViewSelector from './DatasetActicityViewSelector';
import { getDatasetActivityLogsAPI } from '../../../APIs/index';
import logsInfo from './DatasetActivityLogsDisplay';
import styles from './DatasetActivity.module.scss';
import variables from '../../../Themes/constants.scss';

const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';

const DatasetActivity = (props) => {
  const [viewValue, setViewValue] = useState('All');
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [customTimeRange, setCustomTimeRange] = useState([]);
  const [cusTimeRangeChangeTimes, setCusTimeRangeChangeTimes] = useState(0);
  const [activityLogs, setActivityLogs] = useState([]);
  const [publishRecord, setPublishRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(0);
  const [datePickerDisabled, setDatePickerDisabled] = useState(true);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const datasetGeid = datasetInfo.geid;

  const columns = [
    {
      title: 'Date',
      key: 'date',
      with: '20%',
      render: (item, row, index) => {
        if (publishRecord.includes(index)) {
          return (
            <p
              style={{
                fontWeight: 'bold',
                color: variables.primaryColor1,
                margin: '0px',
              }}
            >
              {timeConvertWithOffestValue(item.activityTime, 'datetime')}
            </p>
          );
        } else {
          return timeConvertWithOffestValue(item.activityTime, 'datetime');
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '70%',
      render: (item, row, index) => {
        return logsInfo(item.activityType, item);
      },
    },
    {
      title: 'By',
      key: 'by',
      width: '10%',
      render: (item, row, index) => {
        if (publishRecord.includes(index)) {
          return (
            <p
              style={{
                fontWeight: 'bold',
                color: variables.primaryColor1,
                margin: '0px',
              }}
            >
              {item.user}
            </p>
          );
        } else {
          return <p style={{ margin: '0px' }}>{item.user}</p>;
        }
      },
    },
  ];

  const getDatasetActivityLogs = async () => {
    let queryParams;
    let toTime = moment().endOf('day').unix();
    let fromTime;

    const params = {
      page_size: pageSize,
      page: currentPage,
      sort_by: 'activity_time',
      sort_order: 'desc',
    };

    const timeDiffCal = (timeType) => {
      if (timeType === '1 D') {
        fromTime = moment().startOf('day').unix();
      } else if (timeType === '1 W') {
        fromTime = moment().subtract(7, 'days').unix();
      } else if (timeType === '1 M') {
        fromTime = moment().subtract(1, 'months').unix();
      } else if (timeType === '6 M') {
        fromTime = moment().subtract(6, 'months').unix();
      }

      queryParams = {
        ...params,
        activity_time_start: fromTime,
        activity_time_end: toTime,
      };
    };

    if (viewValue === 'Custom') {
      if (customTimeRange?.length && customTimeRange[0] && customTimeRange[1]) {
        queryParams = {
          ...params,
          activity_time_start: customTimeRange[0].startOf('day').unix(),
          activity_time_end: customTimeRange[1].endOf('day').unix(),
        };
      } else {
        queryParams = { ...params };
      }
    } else {
      if (viewValue === 'All') {
        queryParams = { ...params };
      } else if (viewValue === '1 D') {
        timeDiffCal('1 D');
      } else if (viewValue === '1 W') {
        timeDiffCal('1 W');
      } else if (viewValue === '1 M') {
        timeDiffCal('1 M');
      } else if (viewValue === '6 M') {
        timeDiffCal('6 M');
      }
    }

    try {
      const res = await getDatasetActivityLogsAPI(
        datasetInfo.code,
        queryParams,
      );

      let newArr = [];
      res.data.result.forEach((el, index) => {
        if (el.activity_type === 'release') {
          newArr.push(index);
        }
      });
      setPublishRecord(res.data.result);
      setActivityLogs(res.data.result);
      setTotalItem(res.data.total);
      if (viewValue === 'All') {
        if (res.data.result.length) {
          setLastUpdateTime(res.data.result[0].activity_time);
        } else {
          setLastUpdateTime(null);
        }
      }
    } catch {
      setLastUpdateTime(null);
    }
  };

  useEffect(() => {
    if (datasetGeid) {
      getDatasetActivityLogs();
    }
  }, [datasetGeid, currentPage, pageSize, viewValue, cusTimeRangeChangeTimes]);

  const handleViewSelect = (e) => {
    setViewValue(e.currentTarget.textContent);
    if (e.currentTarget.textContent === 'Custom') {
      setDatePickerDisabled(false);
    } else {
      setDatePickerDisabled(true);
    }
  };

  const handleRangePickerSelect = (date, dateString) => {
    setCustomTimeRange(date);
    setCusTimeRangeChangeTimes(cusTimeRangeChangeTimes + 1);
  };

  const disabledDate = (current) => {
    return current && current >= moment().endOf('day');
  };

  const cardTitle = (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <div className={styles.all_activity}>
        <p>All Activity</p>
      </div>
      {
        <DatasetActivityViewSelector
          viewValue={viewValue}
          changeViewValue={handleViewSelect}
        />
      }
      <div className={styles.custom_time}>
        <RangePicker
          className={styles.range_picker}
          disabled={datePickerDisabled}
          disabledDate={disabledDate}
          onChange={handleRangePickerSelect}
        />
      </div>
      <div className={styles.last_update}>
        <p style={{ fontStyle: 'Italic' }}>
          Last update: {CalTimeDiff(moment(lastUpdateTime).unix())}
        </p>
      </div>
    </div>
  );

  const onTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div style={{ margin: '15px 24px 0px 15px' }}>
      <Card title={cardTitle}>
        <Table
          className={styles.dataset_activity_table}
          columns={columns}
          dataSource={activityLogs}
          onChange={onTableChange}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItem,
            pageSizeOptions: [10, 20, 50],
            showSizeChanger: true,
          }}
          size="middle"
          style={{ tableLayout: 'fixed' }}
        />
      </Card>
    </div>
  );
};

export default DatasetActivity;
