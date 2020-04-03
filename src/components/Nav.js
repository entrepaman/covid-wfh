import React, { useContext } from 'react';

import { GlobalContext } from "../context/GlobalState";

import "./styles/Nav.scss";

export const Nav = () => {
    const { theme, updateTheme } = useContext(GlobalContext);
    const mobile = (window.innerWidth > 0) ? window.innerWidth : window.screen.width <= 480;

    return (
        <nav className={`cw_nav_container ${theme}`}>
            <p className="cw_logo">COVID <sub>wfh</sub></p>
            <p className="cw_selected_lang">
                <span>{ mobile ? "En" : "English" }</span> <i className="material-icons">language</i>
            </p>
            <p className="cw_theme_change" onClick={updateTheme}>
                <span>{theme}</span> <i className="material-icons">{ theme === "Dark" ? "brightness_2" : "wb_sunny" }</i>
            </p>
        </nav>
    )
}
