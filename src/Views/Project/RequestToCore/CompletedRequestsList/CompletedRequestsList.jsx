/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { List } from 'antd';
import styles from './CompletedRequests.module.scss';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import { request2CoreActions } from '../../../../Redux/actions';
import { listAllCopyRequests } from '../../../../APIs';
import { useCurrentProject } from '../../../../Utility';
const CompletedRequestList = (props) => {
  const [currentDataset] = useCurrentProject();
  const projectCode = currentDataset?.code;
  const { activeReq, pageNo, pageSize, total, status } = useSelector(
    (state) => state.request2Core,
  );
  const dispatch = useDispatch();
  const onListClick = (item) => {
    dispatch(request2CoreActions.setActiveReq(item));
  };
  const data = props.reqList ? props.reqList : [];
  async function changePageNo(pageNo) {
    const res = await listAllCopyRequests(projectCode, status, pageNo, 10);
    if (res.data.result) {
      dispatch(request2CoreActions.setReqList(res.data.result));
      dispatch(
        request2CoreActions.setPagination({
          pageNo: pageNo,
          pageSize,
          total,
        }),
      );
    }
  }
  return (
    <List
      size="large"
      bordered={false}
      dataSource={data}
      pagination={
        total < pageSize
          ? null
          : {
              current: pageNo + 1,
              pageSize,
              total,
              onChange: (page, pageSize) => {
                changePageNo(page - 1);
              },
            }
      }
      renderItem={(item, index) => {
        return (
          <List.Item
            className={`${styles.list_item} ${
              activeReq &&
              activeReq.id === item.id &&
              styles.list_item_backgroundColor
            }`}
            id={item.id}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              onListClick(item);
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                }}
              >
                {item.submittedBy +
                  ' / ' +
                  moment(item.submittedAt).format('YYYY-MM-DD HH:mm:ss')}
              </p>
              <p
                style={{
                  color: '#818181',
                  fontSize: 12,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                By{' '}
                {item.completedBy && item.completedAt
                  ? item.completedBy +
                    ' / ' +
                    moment(item.submittedAt).format('YYYY-MM-DD HH:mm:ss')
                  : 'N/A'}
              </p>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default CompletedRequestList;
