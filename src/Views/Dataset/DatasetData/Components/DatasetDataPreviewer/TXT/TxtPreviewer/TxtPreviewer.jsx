/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { DatasetCard as Card } from '../../../../../Components/DatasetCard/DatasetCard';
import { FullscreenOutlined, FileImageOutlined } from '@ant-design/icons';
import { Skeleton, Button, Modal } from 'antd';
import { TxtMonacoEditor } from '../TxtMonacoEditor/TxtMonacoEditor';
import styles from './TxtPreviewer.module.scss';
import { previewDatasetFile } from '../../../../../../../APIs';
import { useSelector, useDispatch } from 'react-redux';
export function TxtPreviewer(props) {
  const { previewFile } = props;
  const [txt, setTxt] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const datasetGeid = datasetInfo.geid;
  const largeFile = previewFile.size > 500 * 1024;
  useEffect(() => {
    async function loadPreview() {
      setLoading(true);
      setLoading(true);
      try {
        const res = await previewDatasetFile(datasetGeid, previewFile.geid);
        setTxt(res.data?.result?.content);
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
        {!loading && <TxtMonacoEditor text={txt} largeFile={largeFile} />}
      </Card>
      <div>
        <Modal
          maskClosable={false}
          onCancel={() => setIsEnlarged(false)}
          footer={null}
          width={'90%'}
          title={name}
          forceRender={true}
          visible={isEnlarged}
          className={styles['enlarged_txt_model']}
        >
          {!loading && <TxtMonacoEditor text={txt} largeFile={largeFile} />}
        </Modal>
      </div>
    </>
  );
}
