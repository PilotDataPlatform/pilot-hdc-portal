/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { store } from '../Redux/store';

export default function reduxActionWrapper(funcs) {
  if (Array.isArray(funcs)) {
    return funcs.map((item) => helper(item));
  } else {
    return helper(funcs);
  }
}

function helper(func) {
  if (typeof func !== 'function') {
    throw new Error('You should pass a function');
  }
  return (actionParams) => {
    store.dispatch(func(actionParams));
  };
}
