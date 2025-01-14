/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { DatasetCard as Card } from '../../Components/DatasetCard/DatasetCard';
import { ExistingSchemaContents } from '../Components/ExistingSchemaContents/ExistingSchemaContents';
import styles from './DatasetSchemaExisting.module.scss';

export default function DatasetSchemaExisting(props) {
  return (
    <Card className={styles['card']} title="Existing Schema">
      <ExistingSchemaContents />
    </Card>
  );
}
