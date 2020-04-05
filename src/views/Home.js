import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from "../context/GlobalState";
import { emptyCheck } from "../utils";

import "./styles/Home.scss";

export const Home = () => {
    const { theme, covid19IndiaData, fetchCovid19Data, sortCovid19IndiaData } = useContext(GlobalContext);
    const [showDistrictTable, toggleShowDistrictTable] = useState({});
    const [searchInputVal, updateSearchInputVal] = useState("");
    const [searchedList, updateSearchedList] = useState([]);
    const [sortedBy, updateSortedBy] = useState({ Confirmed: "desc" });

    const mobile = ((window.innerWidth > 0) ? window.innerWidth : window.screen.width) <= 480;

    useEffect(() => {
        fetchCovid19Data(sortedBy);
        // eslint-disable-next-line
    }, []);

    const districtWiseData = emptyCheck(covid19IndiaData.district) ? {...covid19IndiaData.district} : {};

    const toggleDistrictTable = (city) => {
        const districtTable = { ...showDistrictTable };
        if(typeof districtTable[city] === undefined) {
            districtTable[city] = true;
        } else {
            districtTable[city] = !districtTable[city];
        }

        toggleShowDistrictTable(districtTable);
    }

    const tableHeaderClicked = (col) => {
        let newSortedBy = {...sortedBy};
        if(emptyCheck(sortedBy[col])) {
            newSortedBy[col] = newSortedBy[col] === "asc" ? "desc" : "asc";
        } else {
            newSortedBy = {};
            newSortedBy[col] = "desc";
        }

        sortCovid19IndiaData(covid19IndiaData, newSortedBy);
        updateSortedBy(newSortedBy);
    }

    const searchInputChanged = (e) => {
        const value = e.target.value;
        updateSearchInputVal(value);

        const stateWise = [...covid19IndiaData.state];

        if(emptyCheck(value)) {
            const searchedList = stateWise.filter((st) => st.state.toLowerCase().includes(value.toLowerCase()) || st.state === "Total");
            updateSearchedList(searchedList);
        } else {
            updateSearchedList([]);
        }
    }

    const stateWise = searchedList.length > 0 ? searchedList : emptyCheck(covid19IndiaData.state) && covid19IndiaData.state.length > 0 ? [...covid19IndiaData.state] : [];

    let summary = {}
    if(emptyCheck(stateWise)) {
        stateWise.map((states) => {
            if(states.state === "Total") {
                summary = {
                    total: states.confirmed,
                    deaths: states.deaths,
                    recovered: states.recovered,
                    deltaconfirmed: states.deltaconfirmed,
                    deltadeaths: states.deltadeaths,
                    deltarecovered: states.deltarecovered,
                }
            }

            return null;
        });
    }

    return (
        <div className={`cw_home_container ${theme}`}>
            <div className="cw_header">
                <p className="cw_app_name">COVID-19 Tracker</p>
                <p>
                    {new Date().toLocaleString()}
                </p>
            </div>
            <div className="cw_summary_cards_container">
                <div className="confirmed">
                    <p>Confirmed</p>
                    {
                        emptyCheck(summary.total)
                        ? <p>{summary.total}</p>
                        : null
                    }
                    {
                        emptyCheck(summary.deltaconfirmed)
                        ? <p className="delta_p">+{summary.deltaconfirmed}</p>
                        : null
                    }
                </div>
                <div className="deaths">
                    <p>Deaths</p>
                    {
                        emptyCheck(summary.total)
                        ? <p>{summary.deaths}</p>
                        : null
                    }
                    {
                        emptyCheck(summary.deltadeaths)
                        ? <p className="delta_p">+{summary.deltadeaths}</p>
                        : null
                    }
                </div>
                <div className="recovered">
                    <p>Recovered</p>
                    {
                        emptyCheck(summary.total)
                        ? <p>{summary.recovered}</p>
                        : null
                    }
                    {
                        emptyCheck(summary.deltarecovered)
                        ? <p className="delta_p">+{summary.deltarecovered}</p>
                        : null
                    }
                </div>
                <div className="mortality_rate">
                    <p>{ mobile ? "M.Rate" : "Mortality Rate" }</p>
                    {
                        emptyCheck(summary.total)
                        ? <p>{ (parseInt(summary.deaths) / parseInt(summary.total) * 100).toFixed(2) }%</p>
                        : null
                    }
                </div>
            </div>
            {
                emptyCheck(stateWise)
                ? (
                    <div className="cw_table_graphs_container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="not_hover">
                                        <p>
                                            <span>States</span>
                                        </p>
                                    </th>
                                    <th onClick={() => tableHeaderClicked("Confirmed")}>
                                        <p className={`${emptyCheck(sortedBy.Confirmed) ? "selected" : ""}`}>
                                            <span>{ mobile ? "C" : "Confirmed" }</span>
                                            <i className={`material-icons ${emptyCheck(sortedBy.Confirmed) ? sortedBy.Confirmed === "asc" ? "asc_selected" : "desc_selected" : ""}`}>
                                                {
                                                    emptyCheck(sortedBy.Confirmed)
                                                    ? "arrow_right_alt"
                                                    : "swap_vert"
                                                }
                                            </i>
                                        </p>
                                    </th>
                                    <th onClick={() => tableHeaderClicked("Deaths")}>
                                        <p className={`${emptyCheck(sortedBy.Deaths) ? "selected" : ""}`}>
                                            <span>{ mobile ? "D" : "Deaths" }</span>
                                            <i className={`material-icons ${emptyCheck(sortedBy.Deaths) ? sortedBy.Deaths === "asc" ? "asc_selected" : "desc_selected" : ""}`}>
                                                {
                                                    emptyCheck(sortedBy.Deaths)
                                                    ? "arrow_right_alt"
                                                    : "swap_vert"
                                                }
                                            </i>
                                        </p>
                                    </th>
                                    <th onClick={() => tableHeaderClicked("Recovered")}>
                                        <p className={`${emptyCheck(sortedBy.Recovered) ? "selected" : ""}`}>
                                            <span>{ mobile ? "R" : "Recovered" }</span>
                                            <i className={`material-icons ${emptyCheck(sortedBy.Recovered) ? sortedBy.Recovered === "asc" ? "asc_selected" : "desc_selected" : ""}`}>
                                                {
                                                    emptyCheck(sortedBy.Recovered)
                                                    ? "arrow_right_alt"
                                                    : "swap_vert"
                                                }
                                            </i>
                                        </p>
                                    </th>
                                    {
                                        !mobile
                                        ? <th className="not_hover"><p><span>Last Update</span></p></th>
                                        : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5">
                                        <input
                                            type="text"
                                            value={searchInputVal}
                                            placeholder="Search State"
                                            onChange={searchInputChanged} />
                                    </td>
                                </tr>
                                {
                                    stateWise.map((states) => {
                                        const district = emptyCheck(districtWiseData[states.state]) ? districtWiseData[states.state].districtData : {};
                                        let districtSorted = [];

                                        for(let dist in district) {
                                            districtSorted.push([dist, district[dist], district[dist].confirmed]);
                                        }

                                        districtSorted.sort(function(a, b) {
                                            return b[2] - a[2];
                                        });

                                        return states.state !== "Total"
                                            ? (
                                                <React.Fragment key={states.state}>
                                                    <tr key={states.state}>
                                                        <td className="city">
                                                            <p onClick={() => toggleDistrictTable(states.state)}>
                                                                <i className="material-icons">
                                                                    {
                                                                        emptyCheck(showDistrictTable[states.state]) && showDistrictTable[states.state]
                                                                        ? "arrow_drop_down"
                                                                        : "arrow_right"
                                                                    }
                                                                </i>
                                                                <span>{states.state}</span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="table_td_p">
                                                                <b className="delta">
                                                                    {
                                                                        emptyCheck(states.deltaconfirmed) && states.deltaconfirmed !== 0 && states.deltaconfirmed !== "0"
                                                                        ? `+${states.deltaconfirmed}`
                                                                        : ""
                                                                    }
                                                                </b>
                                                                <span>{states.confirmed}</span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="table_td_p">
                                                                <b className="delta">
                                                                    {
                                                                        emptyCheck(states.deltadeaths) && states.deltadeaths !== 0 && states.deltadeaths !== "0"
                                                                        ? `+${states.deltadeaths}`
                                                                        : ""
                                                                    }
                                                                </b>
                                                                <span>{states.deaths}</span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="table_td_p">
                                                                <b className="delta">
                                                                    {
                                                                        emptyCheck(states.deltarecovered) && states.deltarecovered !== 0 && states.deltarecovered !== "0"
                                                                        ? `+${states.deltarecovered}`
                                                                        : ""
                                                                    }
                                                                </b>
                                                                <span>{states.recovered}</span>
                                                            </p>
                                                        </td>
                                                        {
                                                            !mobile
                                                            ? <td>{states.lastupdatedtime}</td>
                                                            : null
                                                        }
                                                    </tr>
                                                    {
                                                        emptyCheck(showDistrictTable[states.state]) && showDistrictTable[states.state]
                                                        ? (
                                                            <tr>
                                                                <td colSpan="4" className="cw_district_table_cont">
                                                                    <p>
                                                                        <span className="header">
                                                                            <i><b></b>District</i>
                                                                            <i>Confirmed</i>
                                                                        </span>
                                                                        {
                                                                            districtSorted.map((dist, ix) => {
                                                                                return (
                                                                                    <span key={`${dist[0]}-${ix}`}>
                                                                                        <i>
                                                                                            <b className="delta">
                                                                                                {
                                                                                                    parseInt(dist[1].delta.confirmed) > 0
                                                                                                    ? `+${dist[1].delta.confirmed}`
                                                                                                    : ""
                                                                                                }
                                                                                            </b>
                                                                                            {dist[0]}
                                                                                        </i>
                                                                                        <i>{dist[2]}</i>
                                                                                    </span>
                                                                                )
                                                                            })
                                                                        }
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        )
                                                        : null
                                                    }
                                                </React.Fragment>
                                            )
                                            : null
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                )
                : null
            }
        </div>
    )
}