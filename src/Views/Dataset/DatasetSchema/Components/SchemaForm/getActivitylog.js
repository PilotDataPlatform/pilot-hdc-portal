/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';

const getFormUpdateActivityLog = (
  originalFormData,
  formData,
  schemaName,
  schemaProperties,
) => {
  const targets = [];
  for (const key of _.keys(formData)) {
    if (!_.isEqual(originalFormData[key], formData[key]))
      targets.push(schemaProperties[key].title);
  }
  const activity = {
    action: 'UPDATE',
    resource: 'Schema',
    detail: {
      name: schemaName,
      targets,
    },
  };

  return [activity];
};

export { getFormUpdateActivityLog };
