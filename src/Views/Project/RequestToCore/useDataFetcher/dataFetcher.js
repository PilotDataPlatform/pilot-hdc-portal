/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  getRequestFiles,
  getFileManifestAttrs,
  getRequestFilesDetailByGeid,
} from '../../../../APIs';
import { fileExplorerTableActions } from '../../../../Redux/actions';
import _ from 'lodash';
import { message } from 'antd';
import i18n from '../../../../i18n';
class RequestDataSource {
  fetchRoot(
    requstGeid,
    page,
    pageSize,
    order,
    orderType,
    filter,
    partial,
    projectCode,
  ) {
    return getRequestFiles(
      requstGeid,
      page,
      pageSize,
      order,
      orderType,
      filter,
      partial,
      projectCode,
      null,
    );
  }
  fetchFolder(
    requstGeid,
    page,
    pageSize,
    order,
    orderType,
    filter,
    partial,
    projectCode,
    parentId,
  ) {
    return getRequestFiles(
      requstGeid,
      page,
      pageSize,
      order,
      orderType,
      filter,
      partial,
      projectCode,
      parentId,
    );
  }
}

const convertSortKey = (sortKey) => {
  const sortKeyMap = {
    fileName: 'name',
    fileSize: 'file_size',
    createTime: 'uploaded_at',
    owner: 'uploaded_by',
  };
  return sortKeyMap[sortKey] || sortKey;
};

export const fetchTableData = async (
  sourceType,
  isRoot,
  geid,
  page,
  pageSize,
  order,
  orderType,
  filter,
  projectId,
  dispatch,
  reduxKey,
) => {
  order = convertSortKey(order);
  orderType = orderType === 'ascend' ? 'asc' : 'desc';
  dispatch(
    fileExplorerTableActions.setLoading({ geid: reduxKey, param: true }),
  );
  let res;
  let files, total;
  try {
    if (sourceType === 'request') {
      const dataSource = new RequestDataSource();
      if (isRoot) {
        res = await dataSource.fetchRoot(
          geid,
          page,
          pageSize,
          order,
          orderType,
          filter,
          [],
          projectId,
          null,
        );
      } else {
        const requestGeid = reduxKey.split('-').slice(1).join('-');
        res = await dataSource.fetchFolder(
          requestGeid,
          page,
          pageSize,
          order,
          orderType,
          filter,
          [],
          projectId,
          geid,
        );
      }

      files = res.data?.result?.entities;
      total = res.data?.result?.approximateCount;
      const filesWithDetail = [];
      try {
        if (files && files.length) {
          const fileDetailRes = await getRequestFilesDetailByGeid(
            files.map((file) => file['geid']),
          );
          for (let i = 0; i < fileDetailRes.data.result.length; i++) {
            const file = files[i];
            const detail = _.find(
              fileDetailRes.data.result,
              (detail) => detail.id === file.geid,
            );
            filesWithDetail.push(
              _.assign(file, detail, { ...detail.extended.extra }),
            );
          }
        }
      } catch (error) {
        if (error.response?.status !== 400) {
          message.error(`${i18n.t('errormessages:requestToCore.500.0')}`, 3);
        }
      }

      dispatch(
        fileExplorerTableActions.setData({
          geid: reduxKey,
          param: filesWithDetail,
        }),
      );
      dispatch(
        fileExplorerTableActions.setTotal({ geid: reduxKey, param: total }),
      );

      const routes = res.data?.result?.routing;
      if (routes) {
        dispatch(
          fileExplorerTableActions.setRoute({ geid: reduxKey, param: routes }),
        );
      } else {
        dispatch(
          fileExplorerTableActions.setRoute({ geid: reduxKey, param: [] }),
        );
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(
      fileExplorerTableActions.setLoading({ geid: reduxKey, param: false }),
    );
    if (res) return res;
  }
};
