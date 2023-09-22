/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react'

export function usePanel() {
    const [panes, setPanes] = useState([]);
    const [activePane, setActivePane] = useState('');

    const updatePanes = (updatedPanes) => {
        setPanes(updatedPanes);
    }

    const addPane = (newPane) => {
        setPanes((prev) => {
            return [...prev, newPane];
        })
    };

    const activatePane = (panekey) => {
        setActivePane(panekey);
    }
    const removePane = (paneKey) => {
        const panesFiltered = panes.filter((pane) => pane.key !== paneKey);
        setPanes(panesFiltered);
    }
    return {
        panes,
        activePane,
        updatePanes,
        addPane,
        activatePane, removePane,
    }

}