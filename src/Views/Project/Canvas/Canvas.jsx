/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component } from 'react';
import { Row, Spin, Col, Modal, Layout } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import BasicCard from '../../../Components/Cards/BasicCard';
import getCard from './getCard';
import fakeLayout from './fakeLayout';
import DragArea from './DragArea/DragArea';
import CanvasPageHeader from './PageHeader/CanvasPageHeader';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  AddDatasetCreator,
  setCurrentProjectProfile,
} from '../../../Redux/actions';
import { namespace, ErrorMessager } from '../../../ErrorMessages';
import { withCurrentProject } from '../../../Utility';

const { Content } = Layout;

const defaultLayout = {
  initial: { lg: [] },
  admin: {
    lg: [
      { i: '2', x: 0, y: 0, w: 3, h: 6.8 },
      { i: '1', x: 3, y: 0, w: 15, h: 6.8 },
      { i: '3', x: 18, y: 0, w: 6, h: 6.8 },
    ],
    md: [
      { i: '2', x: 0, y: 0, w: 5, h: 6.6 },
      { i: '1', x: 5, y: 0, w: 19, h: 6.6 },
      { i: '3', x: 0, y: 7, w: 24, h: 6.6 },
    ],
    sm: [
      { i: '2', x: 0, y: 0, w: 2.5, h: 6.4 },
      { i: '1', x: 2.5, y: 0, w: 9.5, h: 6.4 },
      { i: '3', x: 0, y: 7, w: 12, h: 6.4 },
    ],
  },
  contributor: {
    lg: [
      { i: '2', x: 0, y: 0, w: 3, h: 6.8 },
      { i: '1', x: 3, y: 0, w: 15, h: 6.8 },
      { i: '3', x: 18, y: 0, w: 6, h: 6.8 },
    ],
    md: [
      { i: '2', x: 0, y: 0, w: 5, h: 6.6 },
      { i: '1', x: 5, y: 0, w: 19, h: 6.6 },
      { i: '3', x: 0, y: 7, w: 24, h: 6.6 },
    ],
    sm: [
      { i: '2', x: 0, y: 0, w: 2.5, h: 6.4 },
      { i: '1', x: 2.5, y: 0, w: 9.5, h: 6.4 },
      { i: '3', x: 0, y: 7, w: 12, h: 6.4 },
    ],
  },
  collaborator: {
    lg: [
      { i: '2', x: 0, y: 0, w: 3, h: 6.8 },
      { i: '1', x: 3, y: 0, w: 15, h: 6.8 },
      { i: '3', x: 18, y: 0, w: 6, h: 6.8 },
    ],
    md: [
      { i: '2', x: 0, y: 0, w: 5, h: 6.6 },
      { i: '1', x: 5, y: 0, w: 19, h: 6.6 },
      { i: '3', x: 0, y: 7, w: 24, h: 6.6 },
    ],
    sm: [
      { i: '2', x: 0, y: 0, w: 2.5, h: 6.4 },
      { i: '1', x: 2.5, y: 0, w: 9.5, h: 6.4 },
      { i: '3', x: 0, y: 7, w: 12, h: 6.4 },
    ],
  },
  member: {
    lg: [
      { i: '2', x: 0, y: 0, w: 3, h: 6.8 },
      { i: '1', x: 3, y: 0, w: 15, h: 6.8 },
      { i: '3', x: 18, y: 0, w: 6, h: 6.8 },
    ],
    md: [
      { i: '2', x: 0, y: 0, w: 5, h: 6.6 },
      { i: '1', x: 5, y: 0, w: 19, h: 6.6 },
      { i: '3', x: 0, y: 7, w: 24, h: 6.6 },
    ],
    sm: [
      { i: '2', x: 0, y: 0, w: 2.5, h: 6.4 },
      { i: '1', x: 2.5, y: 0, w: 9.5, h: 6.4 },
      { i: '3', x: 0, y: 7, w: 12, h: 6.4 },
    ],
  },
};

class Canvas extends Component {
  constructor(props) {
    super(props);
    const datasetCode = this.findStudyId();
    this.state = {
      children: [],
      currentDataset: datasetCode,
      loading: false,
      filter: {},
      modalVisible: false,
      modalTitle: '',
      content: null,
      layout: localStorage.getItem(`layout:${props.username}`)
        ? JSON.parse(localStorage.getItem(`layout:${props.username}`))
        : defaultLayout,
      cardTypes: localStorage.getItem('cardTypes')
        ? JSON.parse(localStorage.getItem('cardTypes'))
        : fakeLayout,
      roleIndex: 0,
      uploader: false,
      currentRole: '',
      currentProject: '',
      pageHeaderExpand: false,
      modalWidth: '95vw',
      currentUser: null,
    };
  }

  findStudyId() {
    const urlArr = window.location.href.split('/');
    return urlArr[urlArr.length - 2];
  }
  componentDidMount() {
    this.setState({ currentUser: this.props.username });
    this.fetchDatasetInfo();
    this.updatePermision();
  }

  componentDidUpdate(prevProps, prevState) {
    let { containersPermission } = this.props;
    if (
      prevProps.containersPermission?.length !== containersPermission?.length
    ) {
      this.updatePermision();
      this.fetchDatasetInfo();
    }
  }

  fetchDatasetInfo = () => {
    const currentProject = this.props.currentProject;
    if (currentProject) {
      this.setState(
        {
          currentProject,
        },
        () => {},
      );
    }
  };

  updatePermision = () => {
    const currentProject = this.props.currentProject;
    if (currentProject?.permission) {
      const role = currentProject.permission;

      this.setState({
        currentRole: role,
      });
    }
  };

  filterData = (filter) => {
    let data = this.state.fulldata;
    Object.keys(filter).map((key) => {
      let rule = filter[key];
      if (rule.length > 0) {
        data = data.filter((item) => {
          if (typeof item[key] === 'boolean') {
            return rule.includes(item[key].toString());
          } else {
            return rule.includes(item[key]);
          }
        });
      }
    });
    this.setState({ data });
  };

  handleMapClick = (e, countryCode) => {
    this.setState((preState) => {
      let filter = preState.filter;
      filter['location'] = _.union(filter['location'], [countryCode]);
      this.filterData(filter);
      return { filter };
    });
  };

  handleChartClick = (key, point) => {
    this.setState((preState) => {
      let filter = preState.filter;
      if (key instanceof Array) {
        filter[point.name] = ['true'];
      } else {
        filter[key] = _.union(filter[key], [point.name]);
      }
      this.filterData(filter);
      return { filter };
    });
  };
  actions = {
    handleMapClick: this.handleMapClick,
    handleChartClick: this.handleChartClick,
  };

  closeTag = (key, value) => {
    this.setState((preState) => {
      let filter = preState.filter;
      let item = filter[key];
      filter[key] = item.filter((el) => el !== value);
      this.filterData(filter);
      return { filter };
    });
  };

  resetTag = () => {
    this.setState({ filter: {} });
    this.filterData({});
  };

  setFilter = (filter) => {
    this.setState({ filter });
    this.filterData(filter);
  };

  handleExpand = (content, title, width) => {
    this.setState({
      modalVisible: true,
      content: content,
      modalTitle: title,
      modalWidth: width,
    });
  };

  handleExpandClose = () => {
    this.setState({
      modalVisible: false,
      content: null,
    });
  };

  handleSaveLayout = () => {
    const { layout, cardTypes } = this.state;
    localStorage.setItem(
      `layout:${this.props.username}`,
      JSON.stringify(layout),
    );
    localStorage.setItem('cardTypes', JSON.stringify(cardTypes));
  };

  handleResetLayout = () => {
    this.setState((state) => {
      return {
        layout: defaultLayout,
        cardTypes: fakeLayout,
      };
    });
  };

  onLayoutChange = (layout, layouts) => {
    const { currentDataset } = this.state;
    const newLayout = Object.assign({}, this.state.layout);
    newLayout[currentDataset] = layout;

    this.setState((state) => {
      return {
        layout: newLayout,
      };
    });
  };

  addACard = (value) => {
    let { layout, cardTypes, currentDataset } = this.state;

    const newKey = Math.max(...Object.keys(layout[currentDataset])) + 1;
    const item = {
      type: value.type,
      col: value.col,
      title: value.title,
      defaultSize: 'm',
      key: newKey,
      expandable: true,
      exportable: true,
    };

    if (!cardTypes[currentDataset]) {
      cardTypes[currentDataset] = fakeLayout[1];
    }
    cardTypes[currentDataset].push(item);

    if (!layout[currentDataset]) {
      layout[currentDataset] = defaultLayout[1];
    }
    layout[currentDataset][newKey] = {
      w: 5,
      h: 3,
      x: 0,
      y: 0,
      i: newKey.toString(),
      moved: false,
      static: false,
    };

    this.setState((state) => {
      return {
        cardTypes,
        layout,
      };
    });
  };

  showUploaderModal = () => {
    this.setState({
      uploader: true,
    });
  };

  handleCancelUploader = () => {
    this.setState({ uploader: false });
  };

  render() {
    let cardContents;
    let tags = [];
    const {
      data,
      filter,
      loading,
      modalVisible,
      modalTitle,
      content,
      cardTypes,
      currentProject,
      currentRole,
      layout,
    } = this.state;

    if (cardTypes[currentRole] ?? cardTypes['member']) {
      cardContents = cardTypes['member'].filter((el) => el.type !== 'info');
    }

    Object.keys(filter).forEach((key) => {
      let items = filter[key];
      items.forEach((i) =>
        tags.push({
          key,
          i,
        }),
      );
    });

    const routes = [
      {
        path: 'index',
        breadcrumbName: 'Projects',
      },
      {
        path: 'first',
        breadcrumbName: this.state.dataSetName,
      },
    ];

    function itemRender(route, params, routes, paths) {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span
          style={{
            maxWidth: 'calc(100% - 74px)',
            display: 'inline-block',
            verticalAlign: 'bottom',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {route.breadcrumbName}
        </span>
      ) : (
        <Link to="/landing">{route.breadcrumbName}</Link>
      );
    }

    return (
      <>
        {loading ? (
          <Spin />
        ) : (
          <>
            <Content
              className="content"
              style={{
                position: 'relative',
                letterSpacing: '0.4px',
                padding: '20px 13px 20px 26px',
              }}
            >
              <Row style={{ paddingBottom: '10px' }}>
                <Col span={24}>
                  <div
                    style={{
                      padding: '0 9px',
                      marginBottom: '8px',
                      width: '100%',
                    }}
                  >
                    <CanvasPageHeader />
                  </div>
                  <DragArea
                    onLayoutChange={this.onLayoutChange}
                    layout={
                      this.state.layout[currentRole] ??
                      this.state.layout['member']
                    }
                    handleSaveLayout={this.handleSaveLayout}
                    handleResetLayout={this.handleResetLayout}
                  >
                    {cardContents &&
                      cardContents.map((card) => {
                        return (
                          <div key={card.key}>
                            <BasicCard
                              className="basic--project_canvas"
                              title={card.title}
                              expandable={card.expandable}
                              exportable={card.exportable}
                              handleExpand={this.handleExpand}
                              defaultSize={card.defaultSize}
                              expandComponent={card.expandComponent}
                              content={getCard(
                                card,
                                data,
                                this.actions,
                                this.state,
                                this.handleExpand,
                              )}
                              currentUser={this.props.username}
                              isAdmin={currentRole === 'admin'}
                            />
                          </div>
                        );
                      })}
                  </DragArea>
                </Col>
                <Modal
                  title={modalTitle}
                  visible={modalVisible}
                  onCancel={this.handleExpandClose}
                  style={{
                    minWidth: this.state.modalWidth,
                  }}
                  footer={null}
                  maskClosable={false}
                >
                  {content}
                </Modal>
              </Row>
            </Content>
          </>
        )}
      </>
    );
  }
}
export default connect(
  (state) => {
    const { datasetList, containersPermission, username, role } = state;
    return { datasetList, containersPermission, username, role };
  },
  { AddDatasetCreator, setCurrentProjectProfile },
)(withCurrentProject(withRouter(Canvas)));
