/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';

export const getHighlightedText = (text, highlight) => {
  const parts = text.split(highlight);

  return (
    <span className="file-name-val">
      {' '}
      {parts.map((part, i) => {
        let divider = i < parts.length - 1 && (
          <b>{highlight.replace(/\s/g, '\u00a0')}</b>
        );
        return (
          <>
            <span>{part.replace(/\s/g, '\u00a0')}</span>
            {divider}
          </>
        );
      })}{' '}
    </span>
  );
};

export const hightLightCaseInsensitive = (text, highlight) => {
  const regObj = new RegExp(highlight, 'gi');
  const hightlightText = <b>{highlight.toLowerCase()}</b>;
  return (
    <span className="file-name-val">
      {text.replace(regObj, hightlightText)}
    </span>
  );
};
