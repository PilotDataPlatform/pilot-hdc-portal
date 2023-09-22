/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Tag, Button, Tooltip, message } from 'antd';
import styles from './DatasetHeaderRight.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getFileSize, getTags } from '../../../../Utility';
import DatasetFilePanel from '../DatasetFilePanel/DatasetFilePanel';
import { RocketOutlined } from '@ant-design/icons';
import PublishNewVersion from '../PublishNewVersion/PublishNewVersion';
import { createKGSpace, getKGSpace } from '../../../../APIs';
import { setKgSpaceBind } from '../../../../Redux/actions';
import { useTranslation } from 'react-i18next';
import { getWithExpiry, setWithExpiry } from '../../../../Utility';

export default function DatasetHeaderRight(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['errormessages', 'success']);
  const [newVersionModalVisibility, setNewVersionModalVisibility] =
    useState(false);
  const {
    basicInfo: { size, totalFiles, tags, code, projectGeid },
  } = useSelector((state) => state.datasetInfo);
  const [kgSpaceBtnLoading, setKgSpaceBtnLoading] = useState(false);
  const { spaceBind } = useSelector((state) => state.kgSpaceList);
  const spaceBindName = spaceBind ? 'collab-hdc-' + spaceBind.name : null;
  const creatingKey = 'collab-hdc-' + code + '-creating';
  const creatingStorage = getWithExpiry(creatingKey, true);
  const [creating, setCreating] = useState(creatingStorage);
  const [checkTriggerKey, setCheckTriggerKey] = useState(1);
  let checkKGTimer = useRef();
  const checkKGFun = async () => {
    const res = await getKGSpace(code);
    if (res.data) {
      dispatch(setKgSpaceBind(res.data));
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    return () => {
      clearInterval(checkKGTimer.current);
    };
  }, []);
  useEffect(() => {
    if (spaceBind === false && getWithExpiry(creatingKey, true)) {
      checkKGTimer.current = setInterval(async () => {
        const kgSpaceCreated = await checkKGFun();
        if (kgSpaceCreated) {
          clearInterval(checkKGTimer.current);
        }
      }, 10 * 1000);
    }
  }, [spaceBind, checkTriggerKey]);
  const createKG = async (e) => {
    if (kgSpaceBtnLoading) {
      return;
    }
    if (!projectGeid) {
      message.error(t('errormessages:createKGSpace.noProjectAssociation.0'));
      return;
    }
    setKgSpaceBtnLoading(true);
    message.warning(
      'Creating KG space can take some time. Please check back later.',
    );
    try {
      setCreating(true);
      setWithExpiry(creatingKey, true, 20 * 60 * 1000);
      await createKGSpace(code);
    } catch (e) {
      dispatch(setKgSpaceBind(false));
      dispatch(setCheckTriggerKey(checkTriggerKey + 1));
      setKgSpaceBtnLoading(false);
      return;
    }
    try {
      await checkKGFun();
    } catch (e) {}
    setKgSpaceBtnLoading(false);

    message.success(t('success:createKGSpace.default.0'));
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles['statistics-container']}>
          <Statistics label="Files">{totalFiles}</Statistics>
          <Statistics label="Size">{getFileSize(size)}</Statistics>
        </div>
        <div style={{ marginTop: '-10px' }}>
          <DatasetFilePanel />
        </div>
      </div>
      <div className={styles['tags-container']}>{getTags(tags)}</div>
      <div className={styles['header-btns-wrap']}>
        {spaceBind !== null ? (
          spaceBind === false ? (
            <Button type="primary" onClick={createKG} disabled={creating}>
              Create KG Space
            </Button>
          ) : (
            <span className={styles['kg-association']}>
              KG Space:{' '}
              <b>
                {spaceBindName.length > 30 ? (
                  <Tooltip title={spaceBindName}>
                    ...
                    {spaceBindName.split('-')[2]}
                  </Tooltip>
                ) : (
                  spaceBindName
                )}
              </b>
            </span>
          )
        ) : null}

        <Button
          icon={<RocketOutlined />}
          type="primary"
          onClick={() => setNewVersionModalVisibility(true)}
        >
          Release New Version
        </Button>
      </div>

      <PublishNewVersion
        newVersionModalVisibility={newVersionModalVisibility}
        setNewVersionModalVisibility={setNewVersionModalVisibility}
      />
    </>
  );
}

const Statistics = (props) => {
  const { label, children } = props;
  return (
    <span className={styles['statistics']}>
      <span className={styles['statistics-title']}>{label}</span>
      <span className={styles['statistics-value']}>{children}</span>
    </span>
  );
};
