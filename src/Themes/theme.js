/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import projectCanvasChart from './Components/Project/Canvas/project_canvas_chart';
import { createTheming } from '@callstack/react-theme-provider';

const theme = {
  projectCanvasChart,
};

const { ThemeProvider, withTheme, useTheme } = createTheming(theme);

export { ThemeProvider, withTheme, useTheme, theme };
