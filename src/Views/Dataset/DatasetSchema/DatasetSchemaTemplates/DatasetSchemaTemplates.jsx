/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React  from 'react';
import {DatasetCard as Card} from '../../Components/DatasetCard/DatasetCard';
import SchemaTemplates from '../Components/SchemaTemplates/SchemaTemplates';
import styles from './DatasetSchemaTemplates.module.scss';

export default function DatasetSchemaTemplates(props) {
    return (
      <Card className={styles.card} title="Schemas">
        <SchemaTemplates />
      </Card>
    );
}