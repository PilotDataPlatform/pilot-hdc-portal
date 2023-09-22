/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import styles from './DatasetData.module.scss';
import DatasetDataExplorer from './Components/DatasetDataExplorer/DatasetDataExplorer';
import DatasetDataPreviewer from './Components/DatasetDataPreviewer/DatasetDataPreviewer';
import { datasetDataActions } from '../../../Redux/actions';
import { useSelector, useDispatch } from 'react-redux';
export default function DatasetData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(datasetDataActions.clearData());
  }, []);
  return (
    <div className={styles['container']}>
      <div className={styles['explorer']}>
        <DatasetDataExplorer />
      </div>{' '}
      <div className={styles['previewer']}>
        <DatasetDataPreviewer />
      </div>{' '}
    </div>
  );
}
