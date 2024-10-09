/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';

export function FileManifest({ currentRecord }) {
  if (!currentRecord.manifest) {
    currentRecord.manifest = [];
  }

  const [attributes, setAttributes] = useState(
    currentRecord.manifest.map((item) => ({
      ...item,
      editing: false,
      draft: item.value,
    })),
  );

  useEffect(() => {
    const manifest = currentRecord.manifest.map((item) => ({
      ...item,
      editing: false,
      draft: item.value,
    }));
    setAttributes(manifest);
  }, [currentRecord]);

  return (
    <>
      <h3 style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
        {currentRecord?.manifest[0]?.manifest_name}
      </h3>
      <Descriptions size="small" column={1}>
        {attributes.map((item, index) => (
          <Descriptions.Item
            label={item.name}
            labelStyle={{ alignItems: 'center' }}
            style={{ wordBreak: 'break-word' }}
          >
            <span>{item.value || <em>null</em>}</span>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
}
