import React from 'react';
import './_App.css';
import MyPerson from "./component/MyPerson";

import "bootstrap/dist/css/bootstrap.min.css"
import MyAccount from "./component/MyAccount";
import MyPersons from "./component/MyPersons";
import MyAccounts from "./component/MyAccounts";
import MyPersonAccounts from "./component/MyPersonAccounts";

interface Person {
    name: string
    age: number
}

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
                    <div className="col"><MyPersonAccounts/></div>
                </div>
            </div>
        </div>
    );
}

export default App;