/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TabNavigation, Tabs } from './index';

function TabSwitcher({ contentMap, colorMap }) {
  const [currentTab, setCurrentTab] = useState(null);
  const activeColor = colorMap[currentTab];

  useEffect(() => {
    if (contentMap) {
      setCurrentTab(Object.keys(contentMap)[0]);
    }
  }, []);

  function handleClick(e) {
    const key = e.target.innerText.toLowerCase();
    setCurrentTab(key);
  }

  return (
    <div>
      <TabNavigation>
        {contentMap &&
          Object.keys(contentMap).map((tab) => (
            <Tabs
              key={uuidv4()}
              handleClick={handleClick}
              tabName={tab}
              currentTab={currentTab}
              activeColor={activeColor}
            />
          ))}
      </TabNavigation>
      {contentMap[currentTab]}
    </div>
  );
}

export default TabSwitcher;
