import React from 'react';
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css"
import MyPerson from "./component/MyPerson";
import MyAccount from "./component/MyAccount";
import MyPersons from "./component/MyPersons";
import MyAccounts from "./component/MyAccounts";
import MyPersonAccount from "./component/MyPersonAccount";


const App = () => {

    return (
        <div className="App">
            <div className="table">
                <div className="row">
                    <div className="col"><MyPerson/></div>
                    <div className="col"><MyAccount/></div>
                </div>
                <div className="row">
                    <div className="col"><MyPersons/></div>
                    <div className="col"><MyAccounts/></div>
                </div>
                <div className="row">
                    <div className="col"><MyPersonAccount/></div>
                </div>
            </div>
        </div>
    );
}

export default App;
