import React from "react";
import {Config, starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup, ListGroup, Table} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";


interface PersonAccount {
    id: string
    accountId: string;
    accountName: string;
    iban: string;
    personId: string;
    personName: string;
    age: number;
}

interface PersonAccountsState {
    personAccounts: PersonAccount[]
    info: string
}

class MyPersonAccounts extends React.Component<{}, PersonAccountsState> {

    constructor(props: any) {
        super(props);
        this.initStates();
        this.initStates = this.initStates.bind(this);
        this.handleReloadList = this.handleReloadList.bind(this);
        this.render = this.render.bind(this);
        setInterval(() => this.handleReloadList(), 200);
    }

    initStates() {
        this.state = ({personAccounts: [], info: "init"});
        this.handleReloadList();
    }


    handleReloadList() {
        fetch("http://localhost:8080/personAccount", {}).then(response => response.json().then(data => {
            console.log(data);
            this.setState({personAccounts: data.content});
            console.log(this.state);
        })).catch(err => {
            console.log(err);
            this.setState({info: err});
        });
    }

    setInfo(err: string) {
        console.log(err);
        this.setState({info: err});
    }

    render() {
         return (
            <div>
                {/*<Button variant="info" onClick={() => this.handleReloadList()}>reload</Button>*/}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>age</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.personAccounts.map(person =>
                        <tr>
                            <td>{person.personName}</td>
                            <td>{person.age}</td>
                            <td>{person.accountName}</td>
                            <td>{person.iban}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MyPersonAccounts;