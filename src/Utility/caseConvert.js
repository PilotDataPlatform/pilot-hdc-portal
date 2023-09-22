/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const _ = require('lodash');

function objectKeysToCamelCase(snake_case_object) {
  var camelCaseObject = _.isArray(snake_case_object) ? [] : {};
  _.forEach(snake_case_object, function (value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = objectKeysToCamelCase(value);
    }
    camelCaseObject[_.camelCase(key)] = value;
  });
  return camelCaseObject;
}

function objectKeysToSnakeCase(camelCaseObject) {
  var snakeCaseObject = _.isArray(camelCaseObject) ? [] : {};
  _.forEach(camelCaseObject, function (value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = objectKeysToSnakeCase(value);
    }
    snakeCaseObject[_.snakeCase(key)] = value;
  });
  return snakeCaseObject;
}

export { objectKeysToCamelCase, objectKeysToSnakeCase };
