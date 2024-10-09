/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { CloseOutlined, } from '@ant-design/icons';

export default function BidsMessage(props) {
    return (
        <div style={{ width: 700, height: 600 }}>
            <div style={{ margin: '5px 20px 0px 20px',}}>
                <h4 >Bids Validation</h4>
                <CloseOutlined 
                    style={{ float: 'right', marginTop: -25 }}
                    onClick={() => console.log('close')}
                />
            </div>
            <Divider style={{ marginTop: 0 }} />
        </div>
    );
}