/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
export const getPath = (path) => {
  if (path === '') {
    return path;
  }
  const pathArr = path.split('/');
  const pathArrSliced = pathArr.slice(0, pathArr.length - 1);
  return pathArrSliced.join('/');
};
