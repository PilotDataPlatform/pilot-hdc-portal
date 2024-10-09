/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';

export function DeleteModalSecondStep({ locked }) {
  return (
    <>
      <p>
        The following {locked.length} file(s)/folder(s) will be skipped because
        there are concurrent file operations are taking place:
      </p>
      {locked && locked.length ? (
        <ul style={{ maxHeight: 90, overflowY: 'auto' }}>
          {locked.map((v) => {
            return <li key={v}>{v}</li>;
          })}
        </ul>
      ) : null}
    </>
  );
}
