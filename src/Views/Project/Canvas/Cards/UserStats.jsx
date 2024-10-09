/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Col, Row, Empty, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { getAuditLogsApi } from '../../../../APIs';
import { useCurrentProject } from '../../../../Utility';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import styles from './index.module.scss';
import { timeConvertWithOffestValue } from '../../../../Utility/timeCovert';

import CustomPagination from '../../../../Components/Pagination/Pagination';
import currentProject from '../../../../Redux/Reducers/currentProject';

function UserStats(props) {
  const [uploadLog, setUploadLog] = useState([]);
  const [downloadLog, setDownloadLog] = useState([]);
  const [copyLogs, setCopyLogs] = useState([]);
  const [deleteLogs, setDeleteLogs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageSize: 10, cur: 1 });
  const [total, setTotal] = useState(0);

  const [currentProject] = useCurrentProject();

  const format = 'YYYY-MM-DD h:mm:ss';

  useEffect(() => {
    if (currentProject) {
      let paginationParams = {
        page_size: pageInfo.pageSize,
        page: pageInfo.cur,
      };
      const query = {
        sort_by: 'activity_time',
        sort_order: 'desc',
      };

      getAuditLogsApi(
        currentProject.globalEntityId,
        paginationParams,
        query,
      ).then((res) => {
        const { total, result } = res.data;
        const deleteList = result.reduce((filtered, el) => {
          let action = el['activityType'];

          if (action === 'delete') {
            filtered.push({
              ...el,
              tag: 'delete',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        const copyList = result.reduce((filtered, el) => {
          let action = el['activityType'];

          if (action === 'copy') {
            filtered.push({
              ...el,
              tag: 'copy',
              userName: props.username,
            });
          }

          return filtered;
        }, []);

        const uploadList = result.reduce((filtered, el) => {
          let action = el['activityType'];

          if (action === 'upload') {
            filtered.push({
              ...el,
              tag: 'upload',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        const downloadList = result.reduce((filtered, el) => {
          let action = el['activityType'];

          if (action === 'download') {
            filtered.push({
              ...el,
              tag: 'download',
              userName: props.username,
            });
          }
          return filtered;
        }, []);

        setDeleteLogs(deleteList);

        setUploadLog(uploadList);

        setCopyLogs(copyList);

        setDownloadLog(downloadList);

        setTotal(total);
      });
    }
  }, [pageInfo, props.successNum, currentProject?.code]);

  const allFileStreams = [
    ...uploadLog,
    ...downloadLog,
    ...copyLogs,
    ...deleteLogs,
  ];

  const sortedAllFileStreams = allFileStreams.sort(
    (a, b) =>
      new Date(b.activityTime).getTime() - new Date(a.activityTime).getTime(),
  );
  const fileStreamIcon = (tag) => {
    if (tag === 'upload') {
      return <CloudUploadOutlined />;
    } else if (tag === 'download') {
      return <DownloadOutlined />;
    } else if (tag === 'copy') {
      return <CopyOutlined />;
    } else if (tag === 'delete') {
      return <DeleteOutlined />;
    }
  };

  const getFolderPath = (fileLog) => {
    let outComePathList;
    if (fileLog.activityType === 'copy') {
      outComePathList = fileLog.changes[0]['newValue'];
    } else {
      outComePathList = '';
    }
    return outComePathList;
  };

  const getFileDisplayName = (fileLog) => {
    if (fileLog.activityType !== 'delete') {
      return fileLog.itemName;
    } else {
      const wholePathList = fileLog.itemName;
      return wholePathList;
    }
  };

  return (
    <div className={styles.card_inner}>
      <Col span={24} style={{ position: 'relative', margin: '10px 0' }}>
        {sortedAllFileStreams.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          sortedAllFileStreams.map((el, ind) => {
            const folderPath = getFolderPath(el);
            return (
              <div className={styles.file}>
                <Row>
                  <span className={styles['file-stream--icon']}>
                    {fileStreamIcon(el.tag)}
                  </span>
                  <span className={styles['file-name']}>
                    {el && el.activityType !== 'download' ? (
                      <Tooltip title={folderPath}>
                        {getFileDisplayName(el)}
                      </Tooltip>
                    ) : (
                      getFileDisplayName(el)
                    )}
                  </span>
                </Row>
                <Row>
                  <div className={styles['connect-line']}></div>
                  <div className={styles['file-descr']}>
                    <span className={styles['user-name']}>{el && el.user}</span>
                    <span
                      className={styles['user-name']}
                      style={{ margin: '-0.4rem 0.5rem' }}
                    >
                      {' '}
                      /{' '}
                    </span>
                    <span className={styles.time}>
                      {el &&
                        el.activityTime &&
                        timeConvertWithOffestValue(el.activityTime, 'datetime')}
                    </span>
                  </div>
                </Row>
              </div>
            );
          })
        )}
      </Col>
      <div className={styles.pagination}>
        <CustomPagination
          onChange={(val) => {
            setPageInfo(val);
          }}
          total={total}
          defaultPage={1}
          defaultSize={10}
          showPageSize={true}
        />
      </div>
    </div>
  );
}

export default connect((state) => ({
  containersPermission: state.containersPermission,
  successNum: state.successNum,
  username: state.username,
}))(withRouter(UserStats));
