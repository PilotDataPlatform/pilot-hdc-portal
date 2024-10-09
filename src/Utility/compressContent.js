/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const supportPostfix = [
  '.zip',
  '.tgz',
  '.tbz',
  '.txz',
  '.tar.gz',
  '.tar.br',
  '.tar.bz2',
  '.tar.xz',
  '.tar.zst',
  '.7z',
  '.rar',
  '.tar',
];

export const checkSupportFormat = function (name) {
  for (let postfix of supportPostfix) {
    if (name.endsWith(postfix)) {
      return true;
    }
  }
  return false;
};
