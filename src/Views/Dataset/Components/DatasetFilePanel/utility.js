/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';
import { JOB_STATUS } from '../../../../Components/Layout/FilePanel/jobStatus';

const countStatus = (fileActions) => {
  let runningCount = 0;
  let errorCount = 0;
  let finishCount = 0;
  let initCount = 0;
  if (fileActions) {
    for (const fileAction of fileActions) {
      switch (fileAction.status) {
        case JOB_STATUS.RUNNING: {
          runningCount++;
          break;
        }
        case JOB_STATUS.FAILED: {
          errorCount++;
          break;
        }
        case JOB_STATUS.SUCCEED: {
          finishCount++;
          break;
        }
        case JOB_STATUS.WAITING: {
          initCount++;
          break;
        }
        default: {
        }
      }
    }
  }

  return [runningCount, errorCount, finishCount, initCount];
};

const parsePath = (payload) => {
  let location = payload.location;
  let res = '';
  if (location) {
    location = _.replace(location, 'minio://', '');
    const url = new URL(location);
    const pathName = url.pathname;
    let pathArr = _.trimStart(pathName, '/').split('/');
    pathArr = pathArr.slice(2);
    res = decodeURIComponent(pathArr.join('/'));
  } else {
    const relativePath = _.trimStart(payload.folderRelativePath, '/');
    let pathArr = relativePath.split('/');
    pathArr = pathArr.slice(1);
    res = decodeURIComponent(pathArr.join('/') + '/' + payload.name);
  }
  return _.trimStart(res, '/');
};

export { countStatus, parsePath };
