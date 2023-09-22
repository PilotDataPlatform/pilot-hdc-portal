/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import {
  SmileOutlined,
  SettingOutlined,
  NotificationOutlined,
  ThunderboltOutlined,
  CloseOutlined,
  BellOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import CloseIcon from '../Icons/Close';
import { withRouter } from 'react-router-dom';
import styles from './index.module.scss';
import { formatDate } from '../../Utility';
import { Button, Tabs, Modal, Spin } from 'antd';
import ProjectAnnouncementCard from '../Notifications/ProjectAnnouncementCard';
import NewsFeedItemInBell from './NewsFeedItemInBell';
import CSSCustomProperties from '../../Themes/Components/BellNotifictions/bellnotifictions.module.css';
import { getAllNewsfeeds } from '../../APIs';
import { bellNotificationActions } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import CustomPagination from '../Pagination/Pagination';
import moment from 'moment';
import {
  timeConvertWithOffestValue,
  mapMinutesToUnitObj,
} from '../../Utility/timeCovert';
const BellNotifications = ({
  visible,
  data,
  openNotificationModal,
  setting,
  user,
}) => {
  const dispatch = useDispatch();
  const { TabPane } = Tabs;
  const PAGE_SIZE = 20;

  const [page, setPageSetting] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    sort_by: 'created_at',
    sort_order: 'desc',
    type: 'pipeline',
  });

  const [dataList, setDataList] = useState([]);
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);
  const [nameWidth, setNameWidth] = useState(0);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementList, setAnnouncementList] = useState(null);
  const [maintenanceList, setMaintenanceList] = useState(null);
  const closeTab = () => {
    dispatch(
      bellNotificationActions.setActiveBellNotification({
        tab: 'Pipeline',
        openModal: false,
        id: -1,
      }),
    );
  };

  useEffect(() => {
    async function initData() {
      try {
        const resDataset = await getAllNewsfeeds(page);

        if (resDataset?.data?.result && resDataset?.data?.result.length) {
          let afterTag = tagDate(resDataset?.data?.result);
          setDataList(afterTag);
          if (resDataset?.data?.result.length < PAGE_SIZE) {
            setLoadMoreBtn(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    async function initProjectAnnouncement() {
      try {
        const resProject = await getAllNewsfeeds({
          type: 'project',
          sort_by: 'created_at',
          sort_order: 'desc',
        });

        if (resProject?.data?.result && resProject?.data?.result.length) {
          const groupedObj = {};
          for (let i = 0; i < resProject?.data?.result.length; i++) {
            const item = resProject?.data?.result[i];
            if (groupedObj.hasOwnProperty(item.projectCode)) {
              groupedObj[item.projectCode].list.push(item);
            } else {
              groupedObj[item.projectCode] = {
                projectCode: item.projectCode,
                projectName: item.projectName,
                list: [item],
              };
            }
          }
          const groupedList = Object.keys(groupedObj).map((key) => {
            return groupedObj[key];
          });
          setAnnouncementList(groupedList);
        }
      } catch (e) {
        console.log(e);
      }
    }
    async function initMaintenance() {
      try {
        const resMaintenance = await getAllNewsfeeds({
          type: 'maintenance',
          sort_by: 'created_at',
          sort_order: 'desc',
        });

        if (
          resMaintenance?.data?.result &&
          resMaintenance?.data?.result.length
        ) {
          setMaintenanceList(resMaintenance?.data?.result);
        }
      } catch (e) {
        console.log(e);
      }
    }
    initData();
    initProjectAnnouncement();
    initMaintenance();
    setTimeout(() => {
      const width = document.getElementById('header_user_menu')?.offsetWidth;
      setNameWidth(width);
    }, 100);
  }, []);

  const changeTab = (key) => {
    dispatch(
      bellNotificationActions.setActiveBellNotification({
        tab: key,
        openModal: true,
        id: 0,
      }),
    );
  };

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

  const loadingMore = async () => {
    let cur = {
      page: page.page + 1,
      page_size: PAGE_SIZE,
      sort_by: 'created_at',
      sort_order: 'desc',
      type: 'pipeline',
    };

    setPageSetting(cur);
    let newData = await getAllNewsfeeds(cur);

    if (newData?.data?.result && newData?.data?.result.length) {
      let newPage = tagDate(newData?.data?.result);
      let prev = dataList;
      prev['today'] = prev['today'].concat(newPage['today']);
      prev['yesterday'] = prev['yesterday'].concat(newPage['yesterday']);
      prev['week'] = prev['week'].concat(newPage['week']);
      prev['month'] = prev['month'].concat(newPage['month']);
      prev['year'] = prev['year'].concat(newPage['year']);
      prev['ago'] = prev['ago'].concat(newPage['ago']);
      setDataList(prev);

      if (newData?.data?.result.length < PAGE_SIZE) {
        setLoadMoreBtn(false);
      }
    }
  };

  return visible ? (
    <div>
      <div
        className={styles['tip-trangle__top']}
        style={{ right: (nameWidth + 156) / 10.0 + 'rem' }}
      ></div>
      <div
        id={styles['bellNotifiction']}
        className={CSSCustomProperties['bellNotifiction']}
      >
        <div className={styles['tabs-header']}>
          <BellOutlined /> &nbsp; <span>Notifications</span>
        </div>
        <Tabs
          defaultActiveKey="Pipeline"
          activeKey={setting.tab ?? 'Pipeline'}
          onChange={changeTab}
          style={{ width: '100%' }}
          tabPosition="left"
          className={styles['tabs']}
        >
          <TabPane
            tab={
              <span>
                <ThunderboltOutlined />
                Pipeline
              </span>
            }
            key="Pipeline"
          >
            <div className={styles['most-recent-text']}>
              <CalendarOutlined />
              <span>Most Recent</span>
            </div>
            {dataList.length == 0 ? null : (
              <div className={styles['date-container']}>
                {dataList['today'].length > 0 && (
                  <li className={styles['date-container__title']}>Today</li>
                )}
                {dataList['today'].length > 0 &&
                  dataList['today'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {dataList['yesterday'].length > 0 && (
                  <li className={styles['date-container__title']}>Yesterday</li>
                )}
                {dataList['yesterday'].length > 0 &&
                  dataList['yesterday'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {dataList['week'].length > 0 && (
                  <li className={styles['date-container__title']}>
                    Last 7 Days
                  </li>
                )}
                {dataList['week'].length > 0 &&
                  dataList['week'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {dataList['month'].length > 0 && (
                  <li className={styles['date-container__title']}>
                    Last Month
                  </li>
                )}
                {dataList['month'].length > 0 &&
                  dataList['month'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {dataList['year'].length > 0 && (
                  <li className={styles['date-container__title']}>Last Year</li>
                )}
                {dataList['year'].length > 0 &&
                  dataList['year'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {dataList['ago'].length > 0 && (
                  <li className={styles['date-container__title']}>
                    1 year ago{' '}
                  </li>
                )}
                {dataList['ago'].length > 0 &&
                  dataList['ago'].map((item, idx) => {
                    return (
                      <NewsFeedItemInBell
                        data={item}
                        id={item.id}
                        setting={setting}
                        user={user}
                      />
                    );
                  })}
                {loadMoreBtn ? (
                  <div
                    className={styles['loading']}
                    onClick={() => loadingMore()}
                  >
                    ...Load More
                  </div>
                ) : (
                  <div className={styles['newsfeed-notice']}>
                    <span className={styles['newsfeed-notice__smile']}>
                      <SmileOutlined />
                    </span>
                    <span className={styles['newsfeed-notice__info']}>
                      That's all your notifications
                    </span>
                  </div>
                )}
              </div>
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <NotificationOutlined />
                Maintenance
              </span>
            }
            key="Maintenance"
          >
            <div className={styles['bellNotifiction__announcement-wrap']}>
              {maintenanceList && maintenanceList.length ? (
                <>
                  <ul className={styles['setting-title']}>
                    <SettingOutlined
                      style={{
                        marginTop: '4px',
                        marginRight: '8px',
                        transform: 'translateY(-1px)',
                        fontSize: 16,
                      }}
                    />
                    Upcoming Maintenance
                  </ul>
                  <div className={styles['maintenance-list']}>
                    {maintenanceList.map((notification, idx) => {
                      return (
                        <li
                          className={styles['bell-item']}
                          onClick={() =>
                            openNotificationModal(notification.id, notification)
                          }
                        >
                          <div className={styles['bell-item__icon']}>
                            <SettingOutlined
                              style={{
                                marginRight: '8px',
                                transform: 'translateY(-1px)',
                                fontSize: 16,
                              }}
                            />
                          </div>
                          <span
                            className={
                              notification.length - 1 == idx
                                ? styles['']
                                : styles['bell-item__connect-line']
                            }
                          ></span>
                          <div className={styles['bell-item__text']}>
                            <span
                              className={styles['bell-item__text-type']}
                            >{`Upcoming Maintenance`}</span>
                            <span>{`${timeConvertWithOffestValue(
                              notification.effectiveDate,
                              'text',
                            )} - Estimated Duration: ${
                              mapMinutesToUnitObj(notification?.durationMinutes)
                                .duration
                            } ${
                              mapMinutesToUnitObj(notification?.durationMinutes)
                                .durationUnit
                            }`}</span>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <NotificationOutlined />
                Project Announcements
              </span>
            }
            key="Project"
          >
            <div className={styles['bellNotifiction__announcement-wrap']}>
              <ul className={styles['project-announcement__title']}>
                <NotificationOutlined
                  style={{
                    marginRight: '0.8rem',
                    fontSize: 17,
                  }}
                />
                Project Announcements
              </ul>

              <div className={styles['project-announcements']}>
                <Spin spinning={announcementLoading}>
                  {announcementList && announcementList.length
                    ? announcementList.map((announcementItem) => {
                        return (
                          <ProjectAnnouncementCard data={announcementItem} />
                        );
                      })
                    : null}
                </Spin>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <div className={styles['close-tab']} onClick={() => closeTab()}>
          <CloseIcon width={10} height={10} color={'#818181'} />
        </div>
      </div>
    </div>
  ) : null;
};

export default connect(
  (state) => ({
    activeBellNotification: state.bellNotificationReducer.actives,
  }),
  {
    setActiveBellNotification:
      bellNotificationActions.setActiveBellNotification,
  },
)(withRouter(BellNotifications));
