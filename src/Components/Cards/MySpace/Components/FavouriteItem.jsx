/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';

import { Row, Col } from 'antd';
import {
  FolderOutlined,
  FileOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';

import { StarButton, PinButton } from '../../../Icons';
import styles from './index.module.scss';

const FavouriteItem = ({
  id,
  type,
  name,
  displayPath,
  pinned,
  isFavouriteEditMode,
  isSaving,
  onClick,
  onStarChange,
  onPinChange,
}) => {
  const splitDisplayPath = displayPath.split('/');
  const projectCode = splitDisplayPath[0];

  const getIcon = () => {
    switch (type) {
      case 'file':
        return <FileOutlined />;
      case 'folder':
        return <FolderOutlined />;
      case 'collection':
        return <PaperClipOutlined />;
    }
  };

  const handleFavouriteClick = () => {
    if (isFavouriteEditMode) {
      return;
    }
    const parentPath = displayPath.split('/').slice(2).join('/');
    onClick(type, projectCode, name, id, displayPath, parentPath);
  };

  const handleStarChange = async (e, { outline }) => {
    return onStarChange(e, { outline, id, type });
  };

  const handlePinChange = (e, { pinStyle }) =>
    onPinChange(e, { id, type, isItemPinned: pinned, pinStyle });

  return (
    <li
      className={
        type === 'collection'
          ? styles['favourite__list-item--collection']
          : styles['favourite__list-item']
      }
      onClick={handleFavouriteClick}
    >
      <Row gutter={10}>
        <Col flex="0 0 16px">{getIcon()}</Col>
        <Col>
          <p
            className={
              isFavouriteEditMode
                ? styles['list-item__name--edit-mode']
                : styles['list-item__name']
            }
          >
            {name}
          </p>
          <p
            className={
              isFavouriteEditMode
                ? styles['list-item__displayPath--edit-mode']
                : styles['list-item__displayPath']
            }
          >
            {displayPath}
          </p>
        </Col>
        <div className={styles['list-item__button-wrap']}>
          <PinButton
            show={isFavouriteEditMode}
            disabled={!isFavouriteEditMode || isSaving}
            pinned={pinned}
            onChange={handlePinChange}
          />
          <StarButton
            className="list-item__star-button"
            disabled={!isFavouriteEditMode || isSaving}
            onChange={handleStarChange}
            outline={false}
          />
        </div>
      </Row>
    </li>
  );
};

export default FavouriteItem;
