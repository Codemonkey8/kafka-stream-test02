import React from 'react';
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css"
import Person from "./component/Person";
import Account from "./component/Account";
import Persons from "./component/Persons";
import Accounts from "./component/Accounts";
import PersonAccounts from "./component/PersonAccounts";
import Usergroup from "./component/Usergroup";
import {StompSessionProvider} from "react-stomp-hooks";

export interface User {
    usergroupId: string
}

export const UserContext = React.createContext<User>({usergroupId: ""});

const App = () => {
    return (
        <StompSessionProvider
            url={"ws://localhost:8080/ws"}
            onConnect={() => {
                console.log("new ws connected");
            }}
        >
            <div className="App">
                <UserContext.Provider value={{usergroupId: "Administrator"}}>
                    <div className="table">
                        <div className="row">
                            <div className="col"><Usergroup/></div>
                        </div>
                        <div className="row">
                            <div className="col"><Person/></div>
                            <div className="col"><Account/></div>
                        </div>
                        <div className="row">
                            <div className="col"><Persons/></div>
                            <div className="col"><Accounts/></div>
                        </div>
                        <div className="row">
                            <div className="col"><PersonAccounts/></div>
                        </div>

                    </div>
                </UserContext.Provider>
            </div>
        </StompSessionProvider>
    );
}

export default App;
