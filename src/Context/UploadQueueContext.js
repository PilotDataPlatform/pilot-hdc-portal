/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import queue from 'async/queue';
import React from 'react';
import { fileUpload } from '../Utility/fileUpload';
import { resumableUpload } from '../Utility/fileUpload';
const filesConcurrency = 1;

const q = queue(function (task, callback) {
  new Promise((resolve, reject) => {
    if (task.resumableInfo) {
      resumableUpload(task, resolve, reject);
    } else {
      fileUpload(task, resolve, reject);
    }
  })
    .then((res) => {
      callback();
    })
    .catch((err) => {
      callback();
    });
}, filesConcurrency);

const UploadQueueContext = React.createContext(q);
export { UploadQueueContext, q };
