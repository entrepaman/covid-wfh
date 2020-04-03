import React, { createContext, useReducer } from "react";
import drive from "drive-db";
import axios from "axios";

import AppReducer from "./AppReducer";

const initialState = {
    lang: "en",
    translate: {},
    theme: "Light",
    stateWiseData: {},
    districtWiseData: {}
}

// Create Context
export const GlobalContext = createContext(initialState);

// Provider Component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const updateLang = (lang) => {
        dispatch({
            type: "UPDATE_LANG",
            lang
        })
    };

    const updateTheme = () => {
        dispatch({
            type: "UPDATE_THEME"
        })
    }

    const fetchData = async ({ sheet, tabs }) => {
        let data = {};
        for(let tabsIx = 0; tabsIx < tabs.length; tabsIx++) {
            const tab = tabs[tabsIx];
            data[tab.label] = await drive({ sheet, tab: tab.tabName });
        }

        dispatch({
            type: "FETCH_STATEWISE_DATA_FROM_SHEET",
            stateWiseData: data
        });
    }

    const fetchDistrictWiseData = async () => {
        const response = await axios.get('https://api.covid19india.org/state_district_wise.json');

        dispatch({
            type: "FETCH_DISTRICT_WISE_DATA",
            districtWiseData: response.data
        });
    }

    return (
        <GlobalContext.Provider value={{
            lang: state.lang,
            theme: state.theme,
            translate: state.translate,
            stateWiseData: state.stateWiseData,
            districtWiseData: state.districtWiseData,
            updateLang,
            fetchData,
            updateTheme,
            fetchDistrictWiseData
        }}>
            {children}
        </GlobalContext.Provider>
    )
}