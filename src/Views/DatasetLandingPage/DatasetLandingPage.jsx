/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { StandardLayout } from '../../Components/Layout';
import DatasetLandingContent from './DatasetLandingContent/DatasetLandingContent';

function DatasetLandingPage(props) {
  return (
    <StandardLayout leftMargin={false}>
      <DatasetLandingContent />
    </StandardLayout>
  );
}

export default DatasetLandingPage;
