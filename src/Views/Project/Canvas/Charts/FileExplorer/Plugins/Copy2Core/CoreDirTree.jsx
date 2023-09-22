/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Tree, Tooltip } from 'antd';
import styles from './index.module.scss';
import { getProjectFiles } from '../../../../../../../APIs';
import { useCurrentProject } from '../../../../../../../Utility';
import { useSelector } from 'react-redux';
import {
  CloudServerOutlined,
  FolderOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PanelKey } from '../../RawTableValues';
import variables from '../../../../../../../Themes/constants.scss';

const { DirectoryTree } = Tree;
const LOAD_MORE_TEXT = '...';
const PAGE_SIZE = 10;
function CoreDirTree(props) {
  const [currentDataset] = useCurrentProject();
  const username = useSelector((state) => state.username);
  const [expandedSelection, setExpandedSelection] = useState([]);
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    async function initTree() {
      const res = await getProjectFiles(
        null,
        null,
        0,
        PAGE_SIZE,
        'name',
        'asc',
        { archived: false, name: username },
        'Core',
        'project',
        null,
        PanelKey.CORE_HOME,
        currentDataset.code,
      );
      const userFolderNode = res?.data?.result?.entities[0];
      if (userFolderNode) {
        setTreeData([
          {
            title: 'Core',
            key: 'core',
            icon: <CloudServerOutlined />,
            children: [
              {
                title: 'My Directory',
                key: `my`,
                icon: null,
                children: [
                  {
                    title: username,
                    key: userFolderNode.geid,
                    icon: <UserOutlined />,
                    children: [],
                  },
                ],
              },
              {
                title: 'Others',
                key: `others`,
                icon: null,
                children: [],
              },
            ],
          },
        ]);
        setExpandedSelection(['core', 'my']);
      }
    }
    initTree();
  }, []);
  function addTreeChildren(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        if (node.children[node.children.length - 1]?.title === LOAD_MORE_TEXT) {
          node.children = node.children.slice(0, node.children.length - 1);
        }
        return { ...node, children: node.children.concat(children) };
      }

      if (node.children) {
        return {
          ...node,
          children: addTreeChildren(node.children, key, children),
        };
      }

      return node;
    });
  }

  function getNodePath(element, key) {
    if (element.key == key) {
      return [];
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        let path = getNodePath(element.children[i], key);
        if (path !== null) {
          path.unshift({
            title: element.children[i].title,
            key: element.children[i].key,
          });
          return path;
        }
      }
    }
    return null;
  }

  function getTitle(name) {
    if (name.length > 30) {
      return <Tooltip title={name}>{name.slice(0, 30)}....</Tooltip>;
    } else {
      return name;
    }
  }

  async function onSelect(selectedKeys, info) {
    if (info.node.key === 'core') {
      props.setStep2SelectDisabled(true);
      return;
    }
    if (info.node.key === 'my') {
      props.setStep2SelectDisabled(true);
      return;
    }
    const isOthers = info.node.key === 'others';
    let data = treeData[0];

    let foundTreeNodePath = getNodePath(data, info.node.key);
    foundTreeNodePath = foundTreeNodePath.slice(1);
    if (foundTreeNodePath.length === 0) {
      props.setStep2SelectDisabled(true);
    } else {
      props.setStep2SelectDisabled(false);
    }

    if (info.node.title === LOAD_MORE_TEXT) {
      props.setDestination(null);
    } else {
      props.setDestination({
        routes: foundTreeNodePath,
        geid: isOthers ? null : info.node.key,
      });
      props.setValidateDestination(false);
    }

    if (info.node.expanded) {
      return;
    }
    if (info.node.children.length !== 0) {
      return;
    }

    let folders;
    let targetGeid;
    const page =
      info.node.key.indexOf('/') == -1
        ? 0
        : Number(info.node.key.split('/')[1]);
    if (isOthers) {
      targetGeid = 'others';
    } else {
      targetGeid =
        info.node.key.indexOf('/') == -1
          ? info.node.key
          : info.node.key.split('/')[0];
    }
    const res = await getProjectFiles(
      foundTreeNodePath
        .filter((v) => v.title !== LOAD_MORE_TEXT)
        .map((v) => v.title)
        .join('/'),
      null,
      page,
      PAGE_SIZE,
      'name',
      'asc',
      { archived: false },
      'Core',
      isOthers ? 'project' : 'folder',
      null,
      PanelKey.CORE_HOME,
      currentDataset.code,
    );
    folders = res.data.result.entities
      ? res.data.result.entities.filter(
          (v) =>
            v.attributes.nodeLabel &&
            v.attributes.nodeLabel.indexOf('Folder') !== -1,
        )
      : [];
    folders = folders.map((v) => {
      return {
        title: getTitle(v.attributes.fileName),
        key: v.geid,
        icon:
          foundTreeNodePath.length === 0 ||
          foundTreeNodePath[0].title === LOAD_MORE_TEXT ? (
            <UserOutlined />
          ) : (
            <FolderOutlined />
          ),
        children: [],
      };
    });
    if (folders.length && folders.length === PAGE_SIZE) {
      folders = folders.concat([
        {
          title: LOAD_MORE_TEXT,
          key: `${targetGeid}/${page + 1}`,
          icon: null,
          children: [],
        },
      ]);
    }

    setTimeout(() => {
      setTreeData((origin) =>
        addTreeChildren(
          origin,
          targetGeid,
          folders.filter((e) => e.title != username),
        ),
      );
    }, 100);
  }

  async function onExpand(info) {
    if (info.length === 1) {
      setExpandedSelection(['core', 'my']);
    } else {
      setExpandedSelection(info);
    }
  }

  return (
    <DirectoryTree
      className={styles.copy_to_core_tree}
      multiple
      onSelect={onSelect}
      treeData={treeData}
      onExpand={onExpand}
      expandedKeys={expandedSelection}
    />
  );
}
export default CoreDirTree;
