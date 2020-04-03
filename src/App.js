import React from 'react';

import { GlobalProvider } from "./context/GlobalState";

import { Nav } from "./components/Nav";
import { Home } from "./views/Home";

import "./App.css";

function App() {
    return (
        <GlobalProvider>
            <div className="App">
                <Nav />
                <Home />
            </div>
        </GlobalProvider>
    );
}

export default App;
