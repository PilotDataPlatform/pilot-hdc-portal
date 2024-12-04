/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect } from 'react';
import { List } from 'antd';
import DatasetCard from '../DatasetCard/DatasetCard';
import styles from './MyDatasetsList.module.scss';
import { useSelector } from 'react-redux';
import { fetchMyDatasets } from './fetchMyDatasets';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../../../Utility';
import updateDatasetListHistory from '../DatasetListHistory';

function MyDatasetsList() {
  const { loading, datasets, total } = useSelector(
    (state) => state.myDatasetList,
  );
  const { username } = useSelector((state) => state);
  const {
    showOnlyMine = 'true',
    projectCode = null,
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = useQueryParams(['showOnlyMine', 'projectCode', 'pageSize', 'page', 'sortBy', 'sortOrder']);
  const creator = (showOnlyMine.toLowerCase() === 'true') ? username : null;
  const history = useHistory();

  useEffect(() => {
    fetchMyDatasets(creator, projectCode, parseInt(page), parseInt(pageSize), sortBy, sortOrder);
  }, [creator, projectCode, page, pageSize, sortBy, sortOrder]);

  const onPaginationChange = (page, pageSize) => {
    const showOnlyMineValue = !!creator;
    updateDatasetListHistory(history, showOnlyMineValue, projectCode, page, pageSize, sortBy, sortOrder);
  };

  const paginationProps = {
    showSizeChanger: true,
    current: parseInt(page),
    pageSize: parseInt(pageSize),
    onChange: onPaginationChange,
    total,
    onShowSizeChange: onPaginationChange,
  };

  return (
    <div className={styles['my-dataset-list']}>
      <List
        loading={loading}
        dataSource={datasets}
        renderItem={(item, index) => {
          return <DatasetCard dataset={item} />;
        }}
        pagination={paginationProps}
      ></List>
    </div>
  );
}

export default MyDatasetsList;
