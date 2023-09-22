/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import styles from './DatasetHome.module.scss';
import DatasetHomeInfo from './DatasetHomeInfo/DatasetHomeInfo';
import DatasetHomeTags from './DatasetHomeTags/DatasetHomeTags';
import DatasetHomeDescription from './DatasetHomeDescription/DatasetHomeDescription';

export default function DatasetHome(props) {
  return (
    <div className={styles['container']}>
      <div className={styles['info']}>
        <DatasetHomeInfo />
      </div>
      <div className={styles['tags']}>
        <DatasetHomeTags />
      </div>
      <div className={styles['description']}>
        <DatasetHomeDescription />
      </div>
    </div>
  );
}
