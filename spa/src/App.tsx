import React from 'react';
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css"
import MyPerson from "./component/MyPerson";
import MyAccount from "./component/MyAccount";
import MyPersons from "./component/MyPersons";
import MyAccounts from "./component/MyAccounts";
import MyPersonAccounts from "./component/MyPersonAccounts";
import MyUsergroup from "./component/MyUsergroup";
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
                            <div className="col"><MyUsergroup/></div>
                        </div>
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
                </UserContext.Provider>
            </div>
        </StompSessionProvider>
    );
}

export default App;
