/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';
import moment from 'moment';

import Newsfeed from './Newsfeed';

import { SmileOutlined, UpCircleFilled } from '@ant-design/icons';

import styles from '../MySpace.module.scss';
import { getAllNewsfeeds } from '../../../APIs';
import { IS_NOTIFICATION_FUNCTIONALITY_ENABLED } from '../../../config';

const NewsFeedList = ({ type, user }) => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    async function initData() {
      const params = {
        page: 1,
        page_size: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      };
      try {
        let resDataset = await getAllNewsfeeds(params);

        if (resDataset?.data?.result && resDataset?.data?.result.length) {
          let afterTag = tagDate(resDataset?.data?.result);
          setDataList(afterTag);
        }
      } catch (e) {
        console.log(e);
      }
    }
    IS_NOTIFICATION_FUNCTIONALITY_ENABLED && initData();
  }, []);

  const tagDate = (data) => {
    let startToday = moment().startOf('day').unix();
    let now = moment().unix();
    let yesterday = moment().subtract(1, 'd').endOf('day').unix();
    let startYesterday = moment().subtract(1, 'd').startOf('day').unix();
    let startWeek = moment().subtract(7, 'd').startOf('day').unix();

    let startMonth = moment().subtract(30, 'd').startOf('day').unix();

    let startYear = moment().subtract(365, 'd').startOf('day').unix();

    const afterTag = data.reduce(
      (accu, item) => {
        let dateFromApi = moment(item.createdAt).unix();
        if (dateFromApi <= now && dateFromApi >= startToday) {
          item.tag = 'today';
        } else if (dateFromApi <= yesterday && dateFromApi >= startYesterday) {
          item.tag = 'yesterday';
        } else {
          if (dateFromApi < startYesterday && dateFromApi >= startWeek) {
            item.tag = 'week';
          } else if (dateFromApi < startWeek && dateFromApi >= startMonth) {
            item.tag = 'month';
          } else if (dateFromApi < startMonth && dateFromApi >= startYear) {
            item.tag = 'year';
          } else {
            item.tag = 'ago';
          }
        }
        accu[item.tag].push(item);

        return accu;
      },

      { today: [], yesterday: [], week: [], month: [], year: [], ago: [] },
    );

    return afterTag;
  };

  const scrollToTop = (idx) => {
    let name = `newsfeedTop`;

    if (name) {
      let anchorElement = document.getElementById(name);
      console.log(anchorElement);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };

  return (
    <div>
      {type === 'empty' || dataList.length == 0 ? (
        <div className={styles['newsfeed-content']}>
          <span className={styles['newsfeed-content__smile']}>
            <SmileOutlined />
          </span>
          <span className={styles['newsfeed-content__info']}>
            No notifications in the last 7 days
          </span>
        </div>
      ) : (
        <div className={styles['date-container']} id="newsfeedTop">
          {dataList['today'].length > 0 && (
            <li className={styles['date-container__title']}>Today</li>
          )}

          {dataList['today'].length > 0 &&
            dataList['today'].map((item, idx) => {
              return (
                <div className={styles['item-container']}>
                  <Newsfeed data={item} id={item.id} user={user} />

                  <div className={styles['connect-line']}></div>
                </div>
              );
            })}
          {dataList['yesterday'].length > 0 && (
            <li className={styles['date-container__title']}>Yesterday</li>
          )}
          {dataList['yesterday'].length > 0 &&
            dataList['yesterday'].map((item, idx) => {
              return (
                <div className={styles['item-container']}>
                  <Newsfeed data={item} id={item.id} user={user} />

                  <div className={styles['connect-line']}></div>
                </div>
              );
            })}
          {dataList['week'].length > 0 && (
            <li className={styles['date-container__title']}>Last 7 Days</li>
          )}
          {dataList['week'].length > 0 &&
            dataList['week'].map((item, idx) => {
              return (
                <div className={styles['item-container']}>
                  <Newsfeed data={item} id={item.id} user={user} />

                  <div className={styles['connect-line']}></div>
                </div>
              );
            })}
          <div className={styles['newsfeed-notice']}>
            <span className={styles['newsfeed-notice__smile']}>
              <SmileOutlined />
            </span>
            <span className={styles['newsfeed-notice__info']}>
              That’s all your recent notifications.
            </span>
          </div>
          {/* <UpCircleFilled
            onClick={() => {
              scrollToTop(0);
            }}
          /> */}
        </div>
      )}
    </div>
  );
};

export default withRouter(NewsFeedList);
