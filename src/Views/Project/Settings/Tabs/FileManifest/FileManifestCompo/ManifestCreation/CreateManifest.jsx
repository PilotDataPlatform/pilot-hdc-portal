/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import CreateManifestTable from './CreateManifestTable';
import { addNewManifest } from '../../../../../../../APIs';
import { useCurrentProject } from '../../../../../../../Utility';
import { validateManifestName } from '../../Utils/FormatValidators';
import i18n from '../../../../../../../i18n';
import styles from '../../../../index.module.scss';
function CreateManifest(props) {
  const [newManifestName, setNewManifestName] = useState('');
  const [currentDataset] = useCurrentProject();
  const [createdAttrs, setCreatedAttrs] = useState([]);
  const [createdStep, setCreatedStep] = useState(1);
  const [createdLoading, setCreatedLoading] = useState(false);
  const [editMode, setEditMode] = useState('default');
  function emptyCreateForm() {
    setNewManifestName('');
    setCreatedAttrs([]);
    setCreatedStep(1);
  }
  return (
    <div>
      {createdStep === 1 ? (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              marginRight: 20,
              color: 'rgba(0,0,0,0.45)',
              fontWeight: 'bold',
            }}
          >
            Attribute Template Name
          </span>
          <Input
            style={{ width: 150, borderRadius: 6 }}
            value={newManifestName}
            onChange={(e) => {
              setNewManifestName(e.target.value);
            }}
          />
        </div>
      ) : null}

      {createdStep === 2 ? (
        <div style={{ marginTop: 10 }}>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.65)',
              margin: '10px 0 20px',
              textAlign: 'center',
            }}
          >
            Define Attributes For Template
          </h4>
          <CreateManifestTable
            editMode={editMode}
            setEditMode={setEditMode}
            createdAttrs={createdAttrs}
            setCreatedAttrs={setCreatedAttrs}
          />
        </div>
      ) : null}

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {createdStep === 1 ? (
          <Button
            type="primary"
            className={styles.button}
            onClick={(e) => {
              const { valid, err } = validateManifestName(
                newManifestName,
                props.manifestList,
              );
              if (!valid) {
                message.error(err);
                return;
              }
              setCreatedStep(2);
            }}
          >
            Next Step
          </Button>
        ) : null}

        {createdStep === 2 ? (
          <Button
            type="primary"
            loading={createdLoading}
            onClick={async (e) => {
              if (editMode !== 'default') {
                message.error(
                  `${i18n.t(
                    'formErrorMessages:manifestSettings.manifestAttrs.saved',
                  )}`,
                );
                return;
              }

              if (createdAttrs.length === 0) {
                message.error(
                  `${i18n.t(
                    'formErrorMessages:manifestSettings.manifestAttrs.empty',
                  )}`,
                );
                return;
              }
              setCreatedLoading(true);
              const attrs = createdAttrs.map((attr) => {
                if (attr.type === 'multiple_choice') {
                  return {
                    name: attr.name,
                    type: attr.type,
                    options: attr.value.split(','),
                    optional: attr.optional,
                  };
                }
                if (attr.type === 'text') {
                  return {
                    name: attr.name,
                    type: attr.type,
                    optional: attr.optional,
                  };
                }
              });
              await addNewManifest(newManifestName, currentDataset.code, attrs);
              await props.loadManifest();
              setCreatedLoading(false);
              props.setIsCreateManifest(false);
              emptyCreateForm();
            }}
          >
            Create
          </Button>
        ) : null}
        <Button
          type="link"
          onClick={(e) => {
            props.setIsCreateManifest(false);
            emptyCreateForm();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
export default CreateManifest;
