/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  datasetInfoCreators,
  schemaTemplatesActions,
} from '../../../Redux/actions';
import DatasetHeader from '../Components/DatasetHeader/DatasetHeader';
import DatasetDrawer from '../Components/DatasetDrawer/DatasetDrawer';
import { Layout, Menu } from 'antd';
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useParams,
} from 'react-router-dom';
import { datasetRoutes } from '../../../Routes';
import styles from './DatasetContent.module.scss';

const { Content } = Layout;

export default function DatasetContent(props) {
  const [datasetDrawerVisibility, setDatasetDrawerVisibility] = useState(false);
  const { pathname } = useLocation();
  const { datasetCode } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(
        datasetInfoCreators.setBasicInfo({
          timeCreated: '',
          creator: '',
          title: '',
          authors: [],
          type: '',
          modality: [],
          collectionMethod: [],
          license: '',
          code: '',
          projectGeid: '',
          size: 0,
          totalFiles: 0,
          description: '',
          geid: '',
          tags: [],
        }),
      );
      dispatch(datasetInfoCreators.setDatasetVersion(''));
      dispatch(schemaTemplatesActions.updateDefaultSchemaList([]));
      dispatch(schemaTemplatesActions.updateDefaultSchemaTemplateList([]));
      dispatch(schemaTemplatesActions.setDefaultActiveKey(''));
      dispatch(schemaTemplatesActions.clearDefaultOpenTab());
      dispatch(schemaTemplatesActions.showTplDropdownList(false));
    };
  }, []);

  const tabName = getTabName(pathname);

  const clickMenu = (e) => {
    history.push(`/dataset/${datasetCode}/${e.key}`);
  };

  return (
    <Content className={styles['content']}>
      <DatasetHeader setDatasetDrawerVisibility={setDatasetDrawerVisibility} />
      <DatasetDrawer
        datasetDrawerVisibility={datasetDrawerVisibility}
        setDatasetDrawerVisibility={setDatasetDrawerVisibility}
      />
      <Menu
        className={styles['menu']}
        onClick={clickMenu}
        selectedKeys={[tabName]}
        mode="horizontal"
      >
        <Menu.Item key="home">Home</Menu.Item>
        <Menu.Item key="data">Explorer</Menu.Item>
        <Menu.Item key="schema">Metadata</Menu.Item>
        <Menu.Item key="activity">Activity</Menu.Item>
      </Menu>

      <Switch>
        {datasetRoutes.map((route, ind) => (
          <Route
            key={`route-${ind}`}
            path={'/dataset/:datasetCode' + route.path}
            render={(props) => <route.component></route.component>}
          ></Route>
        ))}
      </Switch>
    </Content>
  );
}

const getTabName = (pathname) => {
  const arr = pathname.split('/');
  if (arr[3]) {
    return arr[3];
  }
  return '';
};
