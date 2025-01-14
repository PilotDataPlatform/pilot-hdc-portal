/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from "react";
import { Checkbox, Form } from "antd";

function DynamicCheck(props) {
    function onChange(checkedValues) {
        console.log("checked = ", checkedValues);
    }
    return (
        <>
            <Form.Item
                label={<strong>{props.name}</strong>}
                name={props.name}
                key={`check-${props.index}`}
            >
                <Checkbox.Group options={props.options} onChange={onChange} />
            </Form.Item>
        </>
    );
}
export default DynamicCheck;
