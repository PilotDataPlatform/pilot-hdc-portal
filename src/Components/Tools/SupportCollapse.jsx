/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';

const { Panel } = Collapse;

function SupportCollapse(props) {
  const { t } = useTranslation('support');
  const qaList = t('drawers', { returnObjects: true });

  return (
    <>
      {qaList.map((qa) => {
        const panelList = qa.panel;
        return (
          <>
            <p id={qa.title.replace(/\s+/g, '-').toLowerCase()}>
              <strong>{qa.title}</strong>
            </p>
            <Collapse>
              {panelList.map((panelItem, index) => {
                return (
                  <Panel
                    header={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: panelItem.question,
                        }}
                      ></div>
                    }
                    key={
                      qa.title.replace(/\s+/g, '-').toLowerCase() + '-' + index
                    }
                  >
                    <p
                      dangerouslySetInnerHTML={{
                        __html: panelItem.answer,
                      }}
                    ></p>
                  </Panel>
                );
              })}
            </Collapse>
            <br />
          </>
        );
      })}
    </>
  );
}

export default SupportCollapse;
