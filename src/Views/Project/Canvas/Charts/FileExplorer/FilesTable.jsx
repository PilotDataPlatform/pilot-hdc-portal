/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { Table, Input, Button, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.module.scss';
import { TABLE_STATE } from './RawTableValues';
import {
  checkIsVirtualFolder,
  checkGreenAndCore,
} from '../../../../../Utility';
import { connect } from 'react-redux';
import variables from '../../../../../Themes/constants.scss';
class FilesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageSize: 10,
      order: 'desc',
      sortColumn: 'createTime',
      selectedRowKeys: [],
      tags: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tableResetMap && this.props.tableResetMap) {
      const previousResetNum = prevProps.tableResetMap[prevProps.panelKey]
        ? prevProps.tableResetMap[prevProps.panelKey]
        : null;
      const currentResetNum = this.props.tableResetMap[this.props.panelKey]
        ? this.props.tableResetMap[this.props.panelKey]
        : null;
      if (previousResetNum !== currentResetNum) {
        this.setState({
          page: 0,
          pageSize: 10,
          order: 'desc',
          sortColumn: 'createTime',
          inputVisible: false,
          inputValue: '',
          tags: this.props.tags,
        });
        this.props.setSearchText([]);
        return;
      }
    }
  }

  getCurrentSourceType = () => {
    if (checkIsVirtualFolder(this.props.panelKey)) {
      if (this.props.currentRouting?.length === 0) {
        return 'collection';
      } else {
        return 'folder';
      }
    } else if (this.props.panelKey.toLowerCase().includes('trash')) {
      if (this.props.currentRouting?.length === 0) {
        return 'trash';
      } else {
        return 'folder';
      }
    }

    if (
      checkGreenAndCore(this.props.panelKey) &&
      this.props.currentRouting?.length > 0
    ) {
      return 'folder';
    } else {
      return 'project';
    }
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.activePane !== nextProps.activePane) {
      const curSourceType = this.getCurrentSourceType();
      const parentInfo = this.props.getParentPathAndId();
      const params = {
        ...parentInfo,
        page: this.state.page,
        pageSize: this.state.pageSize,
        orderBy: this.state.sortColumn,
        orderType: this.state.order,
        sourceType: curSourceType,
      };
      if (curSourceType === 'folder' && this.props.currentRouting?.length) {
        params.node = {
          nodeLabel:
            this.props.currentRouting[this.props.currentRouting.length - 1]
              .labels,
        };
      }
      this.props.updateTable(params);
    }
  }

  getColumnSearchProps = (dataIndex) => ({
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
          onPressEnter={() => {
            this.handleSearch(selectedKeys, confirm, dataIndex);
          }}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters, dataIndex, confirm)}
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
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  handleReset = (clearFilters, dataIndex, confirm) => {
    clearFilters();
    confirm();
  };

  onChange = (pagination, filters, sorter) => {
    let order = 'asc';

    if (sorter && sorter.order !== 'ascend') order = 'desc';

    this.setState({ page: pagination.current - 1 });
    if (sorter) {
      this.setState({
        sortColumn: sorter.columnKey,
        order,
      });
    }

    if (pagination.pageSize) this.setState({ pageSize: pagination.pageSize });

    let searchText = [];
    let isSearchingFile = false;

    if (filters.fileName && filters.fileName.length > 0) {
      isSearchingFile = true;

      searchText.push({
        key: 'fileName',
        value: filters.fileName[0],
      });
    }

    if (filters.owner && filters.owner.length > 0) {
      isSearchingFile = true;

      searchText.push({
        value: filters.owner[0],
        key: 'owner',
      });
    }
    this.props.setSearchText(searchText);

    const curSourceType = this.getCurrentSourceType();
    const parentInfo = this.props.getParentPathAndId();
    const params = {
      ...parentInfo,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      orderBy: sorter.columnKey,
      orderType: order,
      query: convertFilter(searchText),
      sourceType: curSourceType,
    };
    if (curSourceType === 'folder' && this.props.currentRouting.length) {
      params.node = {
        nodeLabel:
          this.props.currentRouting[this.props.currentRouting.length - 1]
            .labels,
      };
    }
    this.props.updateTable(params);
  };

  render() {
    const { page, pageSize } = this.state;
    const { totalItem } = this.props;

    const columns =
      this.props.columns &&
      this.props.columns.map((el) => {
        if (el.searchKey) {
          return {
            ...el,
            ...this.getColumnSearchProps(el.searchKey),
          };
        }
        return el;
      });
    return (
      <div>
        {
          <Table
            id={`files_table`}
            columns={columns}
            dataSource={this.props.dataSource}
            onChange={this.onChange}
            pagination={{
              current: page + 1,
              pageSize,
              total: totalItem,
              pageSizeOptions: ['10', '20', '50'],
              showSizeChanger: true,
            }}
            loading={this.props.tableLoading}
            className={styles.files_raw_table}
            tableLayout={'fixed'}
            rowKey={(record) => record.geid}
            rowSelection={this.props.rowSelection ? { ...this.props.rowSelection, columnWidth: 40 } : null}
            key={this.props.tableKey}
            rowClassName={(record) => {
              let classArr = [];
              if (
                record.name &&
                this.props.selectedRecord?.name === record.name
              ) {
                classArr.push('selected');
              }
              if (
                record.manifest &&
                record.manifest.length !== 0 &&
                this.props.tableState === TABLE_STATE.MANIFEST_APPLY
              ) {
                classArr.push('manifest-attached');
              }
              return classArr.join(' ');
            }}
          />
        }
      </div>
    );
  }
}

const convertFilter = (searchText) => {
  const filters = {};

  if (searchText.length > 0) {
    for (const item of searchText) {
      filters[item.key] = item.value;
    }
  }
  return filters;
};

export default connect((state) => ({
  tableResetMap: state.fileExplorer.tableResetMap,
}))(FilesTable);
