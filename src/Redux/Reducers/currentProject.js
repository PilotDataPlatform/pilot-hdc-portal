/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  SET_CURRENT_PROJECT_PROFILE,
  SET_CURRENT_PROJECT_SYSTEM_TAGS,
  SET_CURRENT_PROJECT_TREE,
  SET_CURRENT_PROJECT_TREE_VFOLDER,
  SET_CURRENT_PROJECT_TREE_GREEN_ROOM,
  SET_CURRENT_PROJECT_ACTIVE_PANE,
  SET_CURRENT_PROJECT_TREE_CORE,
  SET_CURRENT_PROJECT_TEMPLATES,
  CLEAR_CURRENT_PROJECT,
  SET_PROJECT_WORKBENCH,
} from '../actionTypes';

const init = {
  workbenchDeployedCounter: 0,
  fileAttributesTemplates: null,
};
export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_CURRENT_PROJECT: {
      return {
        workbenchDeployedCounter: 0,
      };
    }
    case SET_CURRENT_PROJECT_TEMPLATES: {
      return {
        ...state,
        fileAttributesTemplates: payload,
      };
    }
    case SET_CURRENT_PROJECT_PROFILE: {
      return { ...state, profile: payload };
    }
    case SET_PROJECT_WORKBENCH: {
      return {
        ...state,
        workbenchDeployedCounter: state.workbenchDeployedCounter + 1,
      };
    }
    case SET_CURRENT_PROJECT_SYSTEM_TAGS: {
      return { ...state, manifest: payload };
    }
    case SET_CURRENT_PROJECT_TREE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          ...payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_VFOLDER: {
      return {
        ...state,
        tree: {
          ...state.tree,
          vfolders: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_GREEN_ROOM: {
      return {
        ...state,
        tree: {
          ...state.tree,
          greenroom: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_CORE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          core: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_ACTIVE_PANE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          active: payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}
