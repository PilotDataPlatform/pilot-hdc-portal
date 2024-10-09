/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {useContext} from 'react';
import {FileExplorerStateContext} from './FileExplorerStateContext'
function useExplorerStateSelector(selector){
    const state = useContext(FileExplorerStateContext);
    if(!state){
        throw new Error('Using useExplorerStateSelector hook without a provider')
    };
    return selector(state);
}