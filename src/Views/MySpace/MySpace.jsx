/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { StandardLayout } from '../../Components/Layout';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  QuestionCircleOutlined,
  EllipsisOutlined,
  CoffeeOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import _ from 'lodash';

import DragArea from '../Project/Canvas/DragArea/DragArea';
import FavouritesCard from '../../Components/Cards/MySpace/FavouritesCard';
import MySpaceCard from '../../Components/Cards/MySpace/MySpaceCard';

import MySpaceEditToolbar from './Components/MySpaceEditToolbar';

import styles from './MySpace.module.scss';

import CSSCustomProperties from '../../Themes/Components/MySpace/myspace.module.css';

import NewsFeedList from './Components/NewsFeedList';

import RecentlyVisitedList from './Components/RecentlyVisitedList';

const RGLProps = {
  margin: [10, 10],
  rowHeight: 150,
};

const DEFAULT_LAYOUT = {
  lg: [
    {
      i: '1',
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
    {
      i: '2',
      x: 6,
      y: 0,
      w: 13,
      h: 4,
    },
    {
      i: '3',
      x: 19,
      y: 0,
      w: 5,
      h: 4,
    },
  ],
  md: [
    { i: '1', x: 0, y: 0, w: 12, h: 3 },
    { i: '2', x: 0, y: 3, w: 24, h: 3 },
    { i: '3', x: 12, y: 0, w: 12, h: 3 },
  ],
  sm: [
    { i: '1', x: 0, y: 0, w: 12, h: 3 },
    { i: '2', x: 0, y: 3, w: 24, h: 3 },
    { i: '3', x: 12, y: 0, w: 12, h: 3 },
  ],
  xxs: [
    { i: '1', x: 0, y: 0, w: 12, h: 3 },
    { i: '2', x: 0, y: 3, w: 24, h: 3 },
    { i: '3', x: 12, y: 0, w: 12, h: 3 },
  ],
};

function MySpace() {
  const username = useSelector((state) => state.username);
  const lastLogin = useSelector((state) => state.user.lastLogin);
  const localStorageKey = `mySpaceLayout:${username}`;
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialGridLayout, setInitialGridLayout] = useState({});
  const [gridLayout, setGridLayout] = useState({});
  const [gridBreakpoint, setGridBreakpoint] = useState('lg');
  const [isSaveLayout, setIsSaveLayout] = useState(false);

  const handleBreakpointChange = (breakpoint) => {
    setGridBreakpoint(breakpoint);
  };

  const removeRGLLayoutKeys = (initialLayout, rglLayout) => {
    const usedKeysMap = initialLayout.reduce((map, gridItem) => {
      map[gridItem.i] = Object.keys(gridItem);
      return map;
    }, {});
    const cleanRGLLayout = rglLayout.map((gridItem) => {
      const usedKeys = usedKeysMap[gridItem.i];
      const newGridItem = {};
      for (let key of usedKeys) {
        newGridItem[key] = gridItem[key];
      }
      return newGridItem;
    });
    return cleanRGLLayout;
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    const defaultLayoutAtCurrentBP = DEFAULT_LAYOUT[gridBreakpoint];
    const cleanRGLLayout = removeRGLLayoutKeys(
      defaultLayoutAtCurrentBP,
      allLayouts[gridBreakpoint],
    );
    const isDefaultLayout = _.isEqual(cleanRGLLayout, defaultLayoutAtCurrentBP);

    if (!initialGridLayout[gridBreakpoint]?.length || isDefaultLayout) {
      return;
    }
    const newLayout = {};
    for (const [breakpoint] of Object.entries(initialGridLayout)) {
      newLayout[breakpoint] = currentLayout;
    }
    setGridLayout(newLayout);
  };

  const handleSaveLayout = () => {
    setIsSaveLayout(true);
  };

  const handleResetLayout = () => {
    setGridLayout(DEFAULT_LAYOUT);
  };

  useEffect(() => {
    const savedLayout = window.localStorage.getItem(localStorageKey);
    const initialLayout = savedLayout
      ? JSON.parse(savedLayout)
      : DEFAULT_LAYOUT;

    setGridLayout(initialLayout);
    setInitialGridLayout(initialLayout);
  }, []);

  useEffect(() => {
    if (isSaveLayout) {
      window.localStorage.setItem(localStorageKey, JSON.stringify(gridLayout));
      setIsSaveLayout(false);
    }
  }, [isSaveLayout]);

  return (
    <StandardLayout leftMargin={false}>
      <div id={styles['my-space']} className={CSSCustomProperties['myspace']}>
        <div className={styles['my-space__header']}>
          <p className={styles['my-space__welcome']}>
            <strong>Hi {username}!</strong>
            {lastLogin ? (
              <>
                Last time you logged in: <b>{lastLogin}</b>
              </>
            ) : null}
          </p>
          <MySpaceEditToolbar
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            gridLayout={gridLayout}
            setGridLayout={setGridLayout}
            initialGridLayout={initialGridLayout}
            handleSaveLayout={handleSaveLayout}
            handleResetLayout={handleResetLayout}
          />
        </div>
        <DragArea
          layout={gridLayout}
          isResizable={isEditMode}
          onBreakpointChange={handleBreakpointChange}
          onLayoutChange={handleLayoutChange}
          cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
          margin={RGLProps.margin}
          rowHeight={RGLProps.rowHeight}
        >
          <div key="1">
            <FavouritesCard isLayoutEdit={isEditMode} username={username} />
          </div>

          <div key="2">
            <MySpaceCard
              title={
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CoffeeOutlined
                    style={{
                      fontSize: '1.5rem',
                      marginTop: '-0.2rem',
                      marginRight: '0.6rem',
                      marginLeft: '0.1rem',
                    }}
                  />{' '}
                  Newsfeed{' '}
                </span>
              }
              bodyStyle={{ minWidth: '400px' }}
              isEditMode={isEditMode}
              isDraggable={isEditMode}
            >
              <div className={styles['newsfeed']}>
                <NewsFeedList type="" user={username} />
              </div>
            </MySpaceCard>
          </div>

          <div key="3">
            <MySpaceCard
              title={
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <HistoryOutlined
                    style={{
                      fontSize: '1.5rem',
                      marginRight: '0.8rem',
                      marginLeft: '0.1rem',
                    }}
                  />{' '}
                  Recently Visited
                </span>
              }
              isEditMode={isEditMode}
              isDraggable={isEditMode}
            >
              <RecentlyVisitedList />
            </MySpaceCard>
          </div>
        </DragArea>
      </div>
    </StandardLayout>
  );
}

export default withRouter(MySpace);
