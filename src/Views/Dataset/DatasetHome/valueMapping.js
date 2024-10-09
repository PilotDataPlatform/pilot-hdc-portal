/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';
import { objectKeysToSnakeCase } from '../../../Utility';

const infoKeys = [
  'title',
  'authors',
  'type',
  'modality',
  'collectionMethod',
  'license',
];

export const extractValues = (basicInfo) => {
  return _.pick(basicInfo, infoKeys);
};

export const generateSubmitData = (oldValues, newValues, keys = infoKeys) => {
  let activities = [];
  const diffKeys = [];

  for (const key of keys) {
    const oldValue = oldValues[key];
    const newValue = newValues[key];
    if (_.isString(oldValue)) {
      if (oldValue !== newValue) {
        diffKeys.push(key);
        const activity = getActivity('UPDATE', key, oldValue, newValue);
        activities.push(activity);
      }
    } else if (_.isArray(oldValue)) {
      const arrayActivities = diffArray(oldValue, newValue, key);
      if (arrayActivities.length === 0) continue;

      diffKeys.push(key);
      activities = [...activities, ...arrayActivities];
    } else {
      throw new TypeError('The value should be either string or string[]');
    }
  }

  const submitData = { ..._.pick(newValues, diffKeys), activity: activities };
  return objectKeysToSnakeCase(submitData);
};

const getActivity = (action, resource, from, to) => {
  return {
    action,
    resource: `Dataset.${_.startCase(_.camelCase(resource)).replace(/ /g, '')}`,
    detail: {
      from,
      to,
    },
  };
};

const diffArray = (oldValue, newValue, key) => {
  const oldValueSorted = oldValue.sort();
  const newValueSorted = newValue.sort();
  if (_.isEqual(oldValueSorted, newValueSorted)) {
    return [];
  }

  const removed = _.difference(oldValue, newValue);
  const added = _.difference(newValue, oldValue);

  if (removed.length > 0 && added.length > 0) {
    let middle;

    if (removed.length > 0) {
      const removedSet = new Set(removed);
      middle = oldValue.filter((item) => !removedSet.has(item));
    }

    return [
      getActivity('REMOVE', key, oldValue, middle),
      getActivity('ADD', key, middle, newValue),
    ];
  }

  if (removed.length > 0) {
    return [getActivity('REMOVE', key, oldValue, newValue)];
  }

  return [getActivity('ADD', key, oldValue, newValue)];
};
