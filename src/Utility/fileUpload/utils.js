/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import * as CryptoJS from 'crypto-js';

const MAX_LENGTH = 1024 * 1024 * 5;

function slice(file, piece = 1024 * 1024 * 5) {
  let totalSize = file.size;
  let start = 0;
  let end = start + piece;
  let chunks = [];
  while (start < totalSize) {
    let blob = file.slice(start, end);
    chunks.push(blob);

    start = end;
    end = start + piece;
  }
  return chunks;
}

function retry(fun, chunk, index, retries, err = null) {
  if (!retries) {
    return Promise.reject(err);
  }
  return fun(chunk, index).catch((err) => {
    return retry(fun, chunk, index, retries - 1, err);
  });
}
function blobToString(blob) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      const result = CryptoJS.enc.Latin1.parse(reader.result);
      resolve(result);
    });
    reader.readAsBinaryString(blob);
  });
}

async function validateChunkHash(file, currentJob) {
  if (!currentJob) {
    return false;
  }
  const chunksKeyList = Object.keys(currentJob.chunksInfo);
  if (chunksKeyList.length) {
    const firstChunkInd = chunksKeyList[0];
    let chunks = slice(file.originFileObj, MAX_LENGTH);
    const blobStr = await blobToString(chunks[firstChunkInd - 1]);
    let hash = CryptoJS.MD5(blobStr);
    return (
      hash.toString(CryptoJS.enc.Hex) === currentJob.chunksInfo[firstChunkInd]
    );
  } else {
    return true;
  }
}
export { slice, retry, MAX_LENGTH, blobToString, validateChunkHash };
