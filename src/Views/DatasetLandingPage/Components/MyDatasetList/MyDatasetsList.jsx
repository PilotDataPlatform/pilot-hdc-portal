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

function MyDatasetsList() {
  const { loading, datasets, total } = useSelector(
    (state) => state.myDatasetList,
  );
  const { username } = useSelector((state) => state);
  const { page = 1, pageSize = 10, showOnlyMine = 'true' } = useQueryParams(['pageSize', 'page', 'showOnlyMine']);
  const creator = (showOnlyMine.toLowerCase() === 'true') ? username : null;
  const history = useHistory();

  useEffect(() => {
    fetchMyDatasets(creator, parseInt(page), parseInt(pageSize));
  }, [creator, page, pageSize]);

  const onPageChange = (page, pageSize) => {
    const showOnlyMineValue = !!creator;
    history.push(`/datasets?showOnlyMine=${showOnlyMineValue}&page=${page}&pageSize=${pageSize}`);
  };

  const onShowSizeChange = (page, pageSize) => {
    const showOnlyMineValue = !!creator;
    history.push(`/datasets?showOnlyMine=${showOnlyMineValue}&page=${page}&pageSize=${pageSize}`);
  };

  const paginationProps = {
    showSizeChanger: true,
    current: parseInt(page),
    pageSize: parseInt(pageSize),
    onChange: onPageChange,
    total,
    onShowSizeChange: onShowSizeChange,
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
