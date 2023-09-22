/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { API_PATH } from '../../config';
import { serverAxios } from '../config';
const SSEBaseURL = API_PATH.replace('portal', '');

export const TaskStreamSSE = (sessionId) => {
  if (process.env.REACT_APP_ENV === 'local') {
    return `http://localhost:3000/pilot/task-stream/?session_id=${sessionId}`;
  }
  return `${SSEBaseURL}task-stream/?session_id=${sessionId}`;
};

export function clearSessionHistory() {
  return serverAxios({
    url: '/v1/task-stream',
    method: 'DELETE',
  });
}
export * from './fileAction';
export * from './datasetFileAction';
