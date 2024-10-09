/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { Component } from "react";
import { Layout } from "antd";
import styles from "./index.module.scss";

const { Sider } = Layout;

export default class QueryCard extends Component {
    render() {
        const { collapsed, content } = this.props;

        return (
            <Sider
                trigger={null}
                collapsed={collapsed}
                collapsedWidth="0"
                zeroWidthTriggerStyle={{
                    backgroundColor: "white",
                    right: "-23px"
                }}
                className={styles.sider}
                width={400}
                theme="light"
            >
                {content ? content : this.props.children}
            </Sider>
        );
    }
}
