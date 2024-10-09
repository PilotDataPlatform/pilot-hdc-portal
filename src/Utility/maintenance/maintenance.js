/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { mapMinutesToUnitObj } from '../timeCovert';
export const mapToNewStructure = (item) => {
  let detail = {};
  detail['maintenanceDate'] = item['effectiveDate'];
  const timeUnit = mapMinutesToUnitObj(item.durationMinutes);
  detail['durationUnit'] = timeUnit['durationUnit'];
  detail['duration'] = timeUnit['duration'];
  item.detail = detail;
  return item;
};
