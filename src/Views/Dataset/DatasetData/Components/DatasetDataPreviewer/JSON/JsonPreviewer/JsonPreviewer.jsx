/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { DatasetCard as Card } from '../../../../../Components/DatasetCard/DatasetCard';
import { FullscreenOutlined, FileImageOutlined } from '@ant-design/icons';
import { Skeleton, Button } from 'antd';
import { JsonMonacoEditor } from '../JsonMonacoEditor/JsonMonacoEditor';
import styles from './JsonPreviewer.module.scss';
import { JsonPreviewerEnlargedModal } from '../JsonPreviewerEnlargedModal/JsonPreviewerEnlargedModal';
import { previewDatasetFile } from '../../../../../../../APIs';
import { useSelector, useDispatch } from 'react-redux';
export function JsonPreviewer(props) {
  const { previewFile } = props;
  const [json, setJson] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const datasetGeid = datasetInfo.geid;
  const largeFile = previewFile.size > 500 * 1024;
  useEffect(() => {
    async function loadPreview() {
      setLoading(true);
      try {
        const res = await previewDatasetFile(datasetGeid, previewFile.geid);
        const isConcatenated = res.data?.result?.isConcatenated;
        if (!isConcatenated) {
          let content = res.data?.result?.content;
          try {
            content = JSON.parse(content);
          } catch (e) {}
          if (content) {
            setJson(content);
          }
        } else {
          setJson(res.data?.result?.content);
        }
        setName(previewFile.name);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    loadPreview();
  }, [previewFile.geid]);

  const onEnlarge = () => {
    setIsEnlarged(true);
  };

  return (
    <>
      <Card
        title={name}
        extra={
          name && (
            <Button
              className={styles['enlarge-button']}
              type="link"
              icon={<FullscreenOutlined />}
              onClick={onEnlarge}
            >
              Enlarge
            </Button>
          )
        }
      >
        {!loading && <JsonMonacoEditor json={json} format={!largeFile} />}
      </Card>
      <JsonPreviewerEnlargedModal
        name={name}
        json={json}
        format={!largeFile}
        isEnlarged={isEnlarged}
        setIsEnlarged={setIsEnlarged}
      />
    </>
  );
}
