/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component } from "react";
import { Layout } from "antd";
import styles from "./index.module.scss";

const { Sider } = Layout;

export default class LeftSider extends Component {
  render() {
    return (
      <Sider
        collapsed={true}
        reverseArrow={true}
        trigger={null}
        className={styles.left_sider}
      >
        {this.props.children}
      </Sider>
    );
  }
}
