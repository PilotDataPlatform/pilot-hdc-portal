/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const updateDatasetListHistory = (history, showOnlyMine, projectCode, page, pageSize, sortBy, sortOrder) => {
  let url = `/datasets?showOnlyMine=${showOnlyMine}`;

  if (projectCode) {
    url += `&projectCode=${projectCode}`;
  }

  url += `&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  history.push(url);
};

export default updateDatasetListHistory;
