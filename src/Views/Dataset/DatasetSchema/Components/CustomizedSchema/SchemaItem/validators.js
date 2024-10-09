/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';

export const getValidator = (form, name, isEdit) => {
  return {
    type: [
      {
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(`Type is required`);
          }
          return Promise.resolve();
        },
      },
    ],
    title: [
      {
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject('The title is required');
          }
          const regex = new RegExp(/^(.){1,20}$/);
          if (!regex.test(value)) {
            return Promise.reject(
              'The title can only contains 1-20 characters',
            );
          }

          const { templateItems } = form.getFieldsValue();
          if (_.isArray(templateItems)) {
            const titles = templateItems.map((item) => item.title);
            const counts = _.countBy(titles, (value) => value);
            if (counts[value] > 1) {
              return Promise.reject('Should not have duplicated title');
            }
          }
          return Promise.resolve();
        },
      },
    ],

    value: [
      {
        validator: async (rule, formValue) => {
          if (
            form.getFieldValue(['templateItems', name, 'type']) ===
            'multiple-choice'
          ) {
            if (!formValue || formValue.length === 0) {
              return Promise.reject('The options are required');
            }
            if (formValue.length > 10) {
              return Promise.reject('Should have no more than 10 options');
            }
            for (const option of formValue) {
              if (option.length > 20) {
                return Promise.reject(
                  "The option's length should be between 1-20",
                );
              }
            }
          }

          return Promise.resolve();
        },
      },
    ],
  };
};
