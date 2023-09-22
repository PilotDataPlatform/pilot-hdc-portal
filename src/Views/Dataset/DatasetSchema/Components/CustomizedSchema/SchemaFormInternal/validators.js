/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash'

export const validators = {
  templateName: (templates) => {
    return [
      {
        validator: async (rule, value) => {
          const isDuplicated = _.find(templates, (item) => value === item.name);
          if (isDuplicated) {
            return Promise.reject(`The template name has been taken`);
          }
          return Promise.resolve();
        },
      },
      {
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject('The template name is required');
          }
          const regex = new RegExp(/^(.){1,30}$/);
          if (!regex.test(value)) {
            return Promise.reject(
              'The template name can only contains 1-30 characters',
            );
          }
          return Promise.resolve();
        },
      },
    ];
  },
};
