/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Tag } from 'antd';
import variables from '../Themes/constants.scss';
const getTags = (tags) => {
  if (tags.length <= 3) {
    return tags.map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>);
  }

  const hideTags = [
    ...tags.slice(0, 3).map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>),
    <Tag
      key="tag-create"
      style={{
        color: variables.primaryColorLight1,
        backgroundColor: '#E6F5FF',
      }}
    >{`+${tags.length - 3}`}</Tag>,
  ];
  return hideTags;
};

export { getTags };
