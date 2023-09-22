/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import SASSVariables from '../../../constants.scss';

const {
  primaryColor1,
  primaryColorLight1,
  primaryColorLightest1,
  primaryColorDark1,
  primaryColor2,
  primaryColorLightest2,
  primaryColorLight2,
  primaryColorDark2,
  primaryColor3,
  primaryColorLight3,
  primaryColorLightest3,
  primaryColorDark3,
  primaryColor4,
  primaryColorLight4,
  primaryColorLightest4,
  primaryColorDark4,
} = SASSVariables;

const blank = '#EBEDF0';

export default {
  groupedColumnLine: {
    column: [primaryColor2, primaryColorLight1],
    line: primaryColor4,
  },
  stackedAreaPlot: [primaryColor1, '#00C959'],
  heatgraph: {
    range: {
      green: [blank, '#d8ebf2', '#8DCFFD', '#3fa9f5', '#0644f4'],
      blue: [blank, '#e6f2d9', '#9CE142', '#00C959', '#00a595'],
      red: [
        blank,
        primaryColorLightest3,
        primaryColorLight3,
        primaryColor3,
        primaryColorDark3,
      ],
      orange: [
        blank,
        primaryColorLightest4,
        primaryColorLight4,
        primaryColor4,
        primaryColorDark4,
      ],
    },
  },
};
