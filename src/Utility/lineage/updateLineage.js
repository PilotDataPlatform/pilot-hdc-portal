/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { fileLineageAPI, getFileManifestAttrs } from '../../APIs';
async function updateLineage(record, direction) {
  try {
    const { geid } = record;
    let recordWithLineage = {};
    const res = await fileLineageAPI(geid, 'file_data', direction);
    const lineageData = res.data && res.data.result;
    const entities = lineageData && lineageData.guidEntityMap;
    for (const key in entities) {
      const entity = entities[key];
      if (entity && entity.attributes?.zone === 0) {
        const data = [];
        data.push(entity.attributes.itemId);
        const manifestRes = await getFileManifestAttrs(data, true);

        if (manifestRes.status === 200) {
          entity.fileManifests =
            manifestRes.data.result &&
            manifestRes.data.result[entity.attributes.itemId];
        }
      }
    }

    recordWithLineage = {
      ...record,
      lineage: lineageData,
      baseEntityGuid: lineageData?.baseEntityGuid,
    };
    return recordWithLineage;
  } catch (error) {
    return null;
  }
}
export { updateLineage };
