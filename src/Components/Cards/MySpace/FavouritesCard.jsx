/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StarFilled } from '@ant-design/icons';
import { Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  getUserFavourites,
  deleteUserFavourite,
  deleteBatchUserFavourites,
  updateUserPin,
  updateBatchUserPin,
} from '../../../APIs';
import { canvasPageActions } from '../../../Redux/actions';
import { history } from '../../../Routes';
import { PanelKey } from '../../../Views/Project/Canvas/Charts/FileExplorer/RawTableValues';
import MySpaceCard from './MySpaceCard';
import { FavouriteItem, FavouriteCardButtons } from './Components';

import styles from '../index.module.scss';

const DEFAULT_FETCH_PAGE = 0;
const DEFAULT_FETCH_PAGE_SIZE = 10;

const FavouritesCard = ({ isLayoutEdit, username }) => {
  const [isFavouriteEditMode, setIsFavouriteEditMode] = useState(false);
  const [updatePinItems, setUpdatePinItems] = useState([]);
  const [removeFavouriteItems, setRemoveFavouriteItems] = useState([]);
  const [fetchPageParams, setFetchPageParams] = useState({
    page: DEFAULT_FETCH_PAGE,
    pageSize: DEFAULT_FETCH_PAGE_SIZE,
  });
  const [fetchTotalPages, setFetchTotalPages] = useState(0);
  const [cancelKey, setCancelKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userFavourites, setUserFavourites] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation(['errormessages']);

  async function fetchUserFavourites({ page, pageSize: page_size }) {
    setIsLoading(true);
    try {
      const response = await getUserFavourites({ page, page_size });
      setFetchTotalPages(response.data.numOfPages);

      if (page > DEFAULT_FETCH_PAGE) {
        setUserFavourites((prevUserFavourites) => [
          ...prevUserFavourites,
          ...response.data.result,
        ]);
      } else {
        setUserFavourites(response.data.result);
      }
    } catch {
      message.error(t('errormessages:favourites.get.0'));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUserFavourites(fetchPageParams);
  }, [fetchPageParams]);

  const removeUserFavourites = async () => {
    if (!removeFavouriteItems.length) return;
    try {
      if (removeFavouriteItems.length > 1) {
        await deleteBatchUserFavourites({
          favourites: removeFavouriteItems,
        });
      } else {
        await deleteUserFavourite({
          id: removeFavouriteItems[0].id,
          type: removeFavouriteItems[0].type,
          user: username,
        });
      }
      setRemoveFavouriteItems([]);
    } catch {
      throw new Error('Error with removing favourites', { cause: 'delete' });
    }
  };

  const updateUserPins = async (filteredUpdatedPinItems) => {
    if (!filteredUpdatedPinItems.length) return;
    try {
      if (filteredUpdatedPinItems.length > 1) {
        await updateBatchUserPin({ favourites: filteredUpdatedPinItems });
      } else {
        await updateUserPin({
          id: filteredUpdatedPinItems[0].id,
          type: filteredUpdatedPinItems[0].type,
          pinned: filteredUpdatedPinItems[0].pinned,
          user: filteredUpdatedPinItems[0].user,
        });
      }
      setUpdatePinItems([]);
    } catch {
      setUpdatePinItems(filteredUpdatedPinItems);
      throw new Error('Error with updating pins', { cause: 'update' });
    }
  };

  async function saveChangesToFavourites() {
    if (!removeFavouriteItems.length && !updatePinItems.length) {
      return message.error(t('errormessages:favourites.unselected.0'));
    }
    const filteredUpdatedPinItems = updatePinItems.filter((item) =>
      removeFavouriteItems.find((favourite) => favourite.id === item.id)
        ? false
        : true,
    );

    setIsSaving(true);
    try {
      await removeUserFavourites();
      await updateUserPins(filteredUpdatedPinItems);

      setIsLoading(true);
      setFetchPageParams({
        page: DEFAULT_FETCH_PAGE,
        pageSize: DEFAULT_FETCH_PAGE_SIZE,
      });
      setIsFavouriteEditMode(false);
    } catch (error) {
      message.error(
        t(
          `errormessages:favourites.save.${
            error.cause === 'delete' ? 'default' : error.cause
          }.0`,
        ),
      );
    }
    setIsSaving(false);
  }

  function cancelEditFavourites() {
    setIsFavouriteEditMode(false);
    setRemoveFavouriteItems([]);
    setUpdatePinItems([]);
    setCancelKey(cancelKey + 1);
  }

  function editFavourites() {
    setIsFavouriteEditMode(true);
  }

  function onFavouriteItemSelect({ id, type }) {
    const itemExists = removeFavouriteItems.find((item) => item.id === id);

    if (itemExists) {
      const filterExistingFavourite = removeFavouriteItems.filter(
        (item) => item.id !== id,
      );
      setRemoveFavouriteItems(filterExistingFavourite);
    } else {
      setRemoveFavouriteItems((prevRemoveFavouriteItems) => [
        ...prevRemoveFavouriteItems,
        { id, type: type === 'collection' ? type : 'item' },
      ]);
    }
  }

  function goToFolder(projectCode, page, parentPath, selectedFileName) {
    dispatch(
      canvasPageActions.setCanvasPage({
        page: page,
        parentPath: parentPath,
        selectedFileName: selectedFileName,
      }),
    );
    history.push(`/project/${projectCode}/data`);
  }

  function goToCollection(projectCode, collectionName, collectionId) {
    dispatch(
      canvasPageActions.setCanvasPage({
        page: 'collection',
        name: collectionName,
        id: collectionId,
      }),
    );
    history.push(`/project/${projectCode}/data`);
  }

  function navigateToFavourite(
    type,
    projectCode,
    name,
    collectionId,
    displayPath,
    parentPath,
  ) {
    const splitDisplayPath = displayPath.split('/');
    const panelKey =
      splitDisplayPath.length && splitDisplayPath[1] === 'Core'
        ? PanelKey.CORE_HOME
        : PanelKey.GREENROOM_HOME;
    switch (type) {
      case 'collection':
        return goToCollection(projectCode, name, collectionId);
      case 'folder':
        return goToFolder(projectCode, panelKey, parentPath, name);
      case 'file':
        return goToFolder(projectCode, panelKey, parentPath, name);
    }
  }

  function onStarChange(e, { outline, id, type }) {
    e.stopPropagation();
    const outlineStyle = outline ? false : true;
    onFavouriteItemSelect({ id, type });

    return outlineStyle;
  }

  function onPinChange(e, { id, type, isItemPinned, pinStyle }) {
    e.stopPropagation();
    const newUpdatedPinItems = [...updatePinItems];
    const foundPinIndex = newUpdatedPinItems.findIndex(
      (item) => item.id === id,
    );

    if (foundPinIndex > -1) {
      newUpdatedPinItems[foundPinIndex].pinned =
        !newUpdatedPinItems[foundPinIndex].pinned;
      setUpdatePinItems(newUpdatedPinItems);
    } else {
      setUpdatePinItems((prevUpdatePinItems) => [
        ...prevUpdatePinItems,
        {
          id,
          type: type === 'collection' ? type : 'item',
          pinned: !isItemPinned,
          user: username,
        },
      ]);
    }

    return !pinStyle;
  }

  function loadMoreUserFavourites() {
    setFetchPageParams((prevFetchPageParams) => ({
      ...prevFetchPageParams,
      page: fetchPageParams.page + 1,
    }));
  }

  return (
    <MySpaceCard
      className="mySpace-favourite"
      title={
        <span>
          <StarFilled
            style={{
              fontSize: '1.5rem',
              marginLeft: '0.1rem',
              marginRight: '0.4rem',
            }}
          />{' '}
          Favorites
        </span>
      }
      extra={
        <FavouriteCardButtons
          isFavouriteEditMode={isFavouriteEditMode}
          isSaving={isSaving}
          onCancel={cancelEditFavourites}
          onSave={saveChangesToFavourites}
          onEdit={editFavourites}
        />
      }
      isEditMode={isLayoutEdit}
      isDraggable={isLayoutEdit}
    >
      <Spin spinning={isLoading}>
        <ul className={styles['mySpace-favourite__list']}>
          {userFavourites.map(({ id, type, name, displayPath, pinned }) => (
            <FavouriteItem
              key={id + cancelKey}
              id={id}
              type={type}
              name={name}
              displayPath={displayPath}
              pinned={pinned}
              isFavouriteEditMode={isFavouriteEditMode}
              isSaving={isSaving}
              onClick={navigateToFavourite}
              onStarChange={onStarChange}
              onPinChange={onPinChange}
            />
          ))}
        </ul>
        {fetchTotalPages - (fetchPageParams.page + 1) > 0 &&
        userFavourites.length ? (
          <button
            className={styles['mySpace-favourite__load-more']}
            onClick={loadMoreUserFavourites}
          >
            Load more...
          </button>
        ) : null}
      </Spin>
    </MySpaceCard>
  );
};

export default FavouritesCard;
