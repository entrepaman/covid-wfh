import React, { useContext, useEffect, useState } from 'react';

import { GlobalContext } from "../context/GlobalState";

import { emptyCheck } from "../utils";

import "./styles/Home.scss";

export const Home = () => {
    const { theme, fetchData, fetchDistrictWiseData, stateWiseData, districtWiseData } = useContext(GlobalContext);
    const [showDistrictTable, toggleShowDistrictTable] = useState({});

    const tabs = [
        {
            label: "statewise",
            tabName: "ovd0hzm"
        },
        {
            label: "timeline",
            tabName: "o6emnqt"
        }
    ];

    useEffect(() => {
        fetchData({ sheet: "1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk", tabs });
        fetchDistrictWiseData();
        // eslint-disable-next-line
    }, []);

    const stateWise = stateWiseData.statewise;

    let summary = {}
    if(emptyCheck(stateWise)) {
        stateWise.map((states) => {
            if(states.state === "Total") {
                summary = {
                    total: states.confirmed,
                    deaths: states.deaths,
                    recovered: states.recovered
                }
            }

            return null;
        });
    }

    const toggleDistrictTable = (city) => {
        const districtTable = { ...showDistrictTable };
        if(typeof districtTable[city] === undefined) {
            districtTable[city] = true;
        } else {
            districtTable[city] = !districtTable[city];
        }

        toggleShowDistrictTable(districtTable);
    }

    const mobile = ((window.innerWidth > 0) ? window.innerWidth : window.screen.width) <= 480;
    console.log(mobile)

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
                </div>
                <div className="deaths">
                    <p>Deaths</p>
                    {
                        emptyCheck(summary.total)
                        ? <p>{summary.deaths}</p>
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
                                    <th>
                                        <p>
                                            <span>States</span>
                                            <i className="material-icons">compare_arrows</i>
                                        </p>
                                    </th>
                                    <th>
                                        <p>
                                            <span>{ mobile ? "C" : "Confirmed" }</span>
                                            <i className="material-icons">compare_arrows</i>
                                        </p>
                                    </th>
                                    <th>
                                        <p>
                                            <span>{ mobile ? "D" : "Deaths" }</span>
                                            <i className="material-icons">compare_arrows</i>
                                        </p>
                                    </th>
                                    <th>
                                        <p><span>{ mobile ? "R" : "Recovered" }</span><i className="material-icons">compare_arrows</i></p></th>
                                    {
                                        !mobile
                                        ? <th><p><span>Last Update</span></p></th>
                                        : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5">
                                        <input type="text" placeholder="Search City" />
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
                                                        <td>{states.confirmed}</td>
                                                        <td>{states.deaths}</td>
                                                        <td>{states.recovered}</td>
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