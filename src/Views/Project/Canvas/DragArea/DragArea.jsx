/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './dragArea.scss';

class DragArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compactType: 'vertical',
    };
  }

  render() {
    return (
      <>
        {this.props.layout ? (
          <ResponsiveGridLayout
            width={this.props.size.width}
            layouts={this.props.layout}
            onBreakpointChange={this.onBreakpointChange}
            draggableHandle={'.dragarea'}
            measureBeforeMount={true}
            compactType={this.state.compactType}
            verticalCompact={true}
            preventCollision={!this.state.compactType}
            {...this.props}
          >
            {this.props.children}
          </ResponsiveGridLayout>
        ) : null}
      </>
    );
  }
}

DragArea.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

DragArea.defaultProps = {
  rowHeight: 100,
  onLayoutChange: function () {},
  cols: { lg: 24, md: 24, sm: 12, xs: 3, xxs: 3 },
};

export default withSize()(DragArea);
