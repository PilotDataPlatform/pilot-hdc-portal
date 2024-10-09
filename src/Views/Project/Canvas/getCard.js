/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { List } from 'antd';
import {
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  SlackOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FileExplorer from './Charts/FileExplorer/FileExplorer';
import Description from './Charts/Description/Description';
import FileStats from './Cards/FileStats';
import UserStats from './Cards/UserStats';
import Charts from './Cards/Charts';
import FileStatModal from '../Canvas/Modals/FileStatModal';

const getcard = (card, data, actions, state, handleExpand) => {
  let res;
  switch (card.type) {
    case 'text':
      res = <Description content={card.content} />;
      break;
    case 'fileStats':
      res = <FileStats projectRole={state.currentRole} />;
      break;
    case 'userStats':
      const onExpand = () =>
        handleExpand(
          React.cloneElement(<FileStatModal />, {
            currentUser: state.currentUser,
            isAdmin: state.currentRole === 'admin',
          }),
          'File Stream Advanced Search' || card.title,
          '55vw',
        );
      res = (
        <UserStats
          onExpand={onExpand}
          isAdmin={state.currentRole === 'admin'}
        />
      );
      break;
    case 'files': {
      res = (size, exportState, onExportClick) => {
        return <FileExplorer />;
      };
      break;
    }
    case 'charts':
      res = <Charts projectRole={state.currentProjectRole} />;
      break;
    default:
      break;
  }
  return res;
};

export default getcard;
