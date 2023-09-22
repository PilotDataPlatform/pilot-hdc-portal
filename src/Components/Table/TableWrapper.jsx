/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { Table, Input, Button, Space, Badge, Tooltip } from 'antd';
import { SearchOutlined, CrownFilled } from '@ant-design/icons';
import React from 'react';
import styles from './index.module.scss';
import { partialString } from '../../Utility';
import variables from '../../Themes/constants.scss';
import { v4 as uuidv4 } from 'uuid';
class TableWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      page: 0,
      pageSize: 10,
      order: 'desc',
      sortColumn: 'createTime',
    };
  }

  statusMap = {
    active: 'success',
    pending: 'warning',
    hibernate: 'error',
    null: 'success',
    disabled: 'error',
  };

  getColumnSearchProps = (dataIndex, tableKey) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={(e) => {
            this.props.handleSearch(selectedKeys, confirm, dataIndex);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              this.props.handleSearch(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              this.props.handleReset(clearFilters, dataIndex, confirm)
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? variables.primaryColorLight1 : undefined,
          top: '60%',
        }}
      />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.select();
        }, 100);
      }
    },
    render: (text, record) => {
      if (text && text.length > 30) {
        text = partialString(text, 30, true);
      }

      if (dataIndex === 'name') {
        const status =
          tableKey === 'projectUsers' ? record.projectStatus : record.status;

        const statusBadge = (
          <Tooltip placement="top" title={status === 'hibernate' ? '' : status}>
            <Badge status={this.statusMap[status]} />
          </Tooltip>
        );
        const adminCrown = record.role && record.role === 'admin' && (
          <CrownFilled style={{ color: 'gold', marginLeft: 5 }} />
        );
        return (
          <>
            {statusBadge}
            &nbsp;
            {text}
            {adminCrown}
          </>
        );
      } else if (
        tableKey &&
        tableKey === 'platformInvitations' &&
        dataIndex === 'email'
      ) {
        return (
          <>
            {text}
            {!record.projectId && record.role && record.role === 'admin' && (
              <CrownFilled style={{ color: 'gold', marginLeft: 5 }} />
            )}
          </>
        );
      } else if (
        tableKey &&
        tableKey === 'projectInvitations' &&
        dataIndex === 'email'
      ) {
        return (
          <>
            {text}
            {record.projectId && record.role && record.role === 'admin' && (
              <CrownFilled style={{ color: 'gold', marginLeft: 5 }} />
            )}
          </>
        );
      } else {
        return text;
      }
    },
  });

  render() {
    const {
      totalItem,
      page,
      pageSize,
      dataSource,
      width,
      setClassName,
      tableKey,
      style,
      pageSizeOptions,
    } = this.props;

    const columns =
      this.props.columns &&
      this.props.columns.map((el) => {
        if (el.searchKey) {
          return {
            ...el,
            ...this.getColumnSearchProps(el.searchKey, tableKey),
          };
        }
        return el;
      });

    const pagenationParams = {
      current: page + 1,
      pageSize,
      total: totalItem,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    if (this.props.pageSizeOptions) {
      pagenationParams['pageSizeOptions'] = this.props.pageSizeOptions;
    }
    return (
      <Table
        className={
          this.props.variant
            ? styles[`table_wrapper--${this.props.variant}`]
            : styles.table_wrapper
        }
        columns={columns}
        dataSource={dataSource}
        onChange={this.props.onChange}
        tableLayout={'auto'}
        pagination={pagenationParams}
        key={this.props.tableKey ? this.props.tableKey : uuidv4()}
        rowKey={(_record) => _record.id || _record.geid}
        width={width}
        rowClassName={setClassName}
        style={style}
      />
    );
  }
}

export default TableWrapper;
