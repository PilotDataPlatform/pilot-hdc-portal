/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { getDatasetsListingAPI } from '../../../../APIs';
import { store } from '../../../../Redux/store';
import { myDatasetListCreators } from '../../../../Redux/actions';
import { message } from 'antd';
import i18n from '../../../../i18n';
import _ from 'lodash';

const dispatch = store.dispatch;

export const fetchMyDatasets = (username, page = 1, pageSize) => {
  if (!_.isNumber(page)) {
    throw new TypeError('page should be a number');
  }
  if (!_.isNumber(pageSize)) {
    throw new TypeError('pageSize should be a number');
  }
  dispatch(myDatasetListCreators.setLoading(true));
  getDatasetsListingAPI(username, {
    filter: {},
    sort_by: 'created_at',
    sort_order: 'desc',
    page: page - 1,
    page_size: pageSize,
  })
    .then((res) => {
      dispatch(myDatasetListCreators.setDatasets(res.data.result));
      dispatch(myDatasetListCreators.setTotal(res.data.total));
    })
    .catch((err) => {
      if (err.response?.status === 500) {
        message.error(i18n.t('errormessages:getDatasets.500.0'));
      } else {
        message.error(i18n.t('errormessages:getDatasets.default.0'));
      }
    })
    .finally(() => {
      dispatch(myDatasetListCreators.setLoading(false));
    });
};
