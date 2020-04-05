import React, { createContext, useReducer } from "react";
import axios from "axios";

import AppReducer from "./AppReducer";

const initialState = {
    lang: "en",
    translate: {},
    theme: "Light",
    covid19IndiaData: {}
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

    const fetchCovid19Data = async (sortedBy) => {
        const covid19IndiaDataResp = await axios.get("http://localhost:4000/api/v1/get-covid19-data");
        const covid19IndiaData = covid19IndiaDataResp.data.data;

        sortCovid19IndiaData(covid19IndiaData, sortedBy);
    }

    const sortCovid19IndiaData = (covid19IndiaData, sortedBy) => {
        const stateData = [...covid19IndiaData.state];
        const sortByKey = Object.keys(sortedBy)[0];

        stateData.sort(function(a, b) {
            const x = sortByKey.toLowerCase();

            if(sortedBy[sortByKey] === "asc") {
                return a[x] - b[x];
            } else {
                return b[x] - a[x];
            }
        });

        dispatch({
            type: "FETCH_COVID19_DATA",
            covid19IndiaData: {
                ...covid19IndiaData,
                state: [...stateData]
            }
        });
    }

    return (
        <GlobalContext.Provider value={{
            lang: state.lang,
            theme: state.theme,
            translate: state.translate,
            covid19IndiaData: state.covid19IndiaData,
            updateLang,
            updateTheme,
            fetchCovid19Data,
            sortCovid19IndiaData
        }}>
            {children}
        </GlobalContext.Provider>
    )
}