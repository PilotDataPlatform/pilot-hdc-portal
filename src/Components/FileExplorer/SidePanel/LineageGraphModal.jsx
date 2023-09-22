/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Modal, Button, Select, Spin } from 'antd';
import LineageGraph from './LineageGraph';
import styles from './index.module.scss';

const { Option } = Select;

function LineageGraphModal(props) {
  const handleChange = (value) => {
    props.setLoading(true);
    props.setDirection(value);
    props.updateLineage(props.record, value);
  };

  const graphConfig = {
    modes: {
      default: [
        {
          type: 'scroll-canvas',
          direction: 'y',
          zoomKey: 'shift',
        },
        'drag-canvas',
      ],
    },
  };
  return (
    <Spin className={styles.lineage_spin} spinning={props.loading}>
      <Modal
        title="Data Lineage Graph"
        visible={props.visible}
        onOk={props.handleLineageCancel}
        onCancel={() => {
          props.handleLineageCancel();
        }}
        footer={[
          <Button key="back" onClick={props.handleLineageCancel}>
            OK
          </Button>,
        ]}
      >
        <div style={{ float: 'right', marginTop: -20 }}>
          <Select
            style={{ width: 140, marginLeft: 10 }}
            defaultValue="INPUT"
            onChange={handleChange}
            value={props.direction}
          >
            <Option value="INPUT">Upstream</Option>
            <Option value="OUTPUT">Downstream</Option>
            <Option value="BOTH">All Nodes</Option>
          </Select>
        </div>
        <Spin size="large" spinning={props.loading}>
          <LineageGraph
            record={props.record}
            width={472}
            graphConfig={graphConfig}
            showFitView
          />
        </Spin>
      </Modal>
    </Spin>
  );
}

export default LineageGraphModal;
