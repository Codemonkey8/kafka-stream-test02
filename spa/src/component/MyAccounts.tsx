import React from "react";
import {Config, starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup, ListGroup, Table} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";


interface Account {
    id: string
    name: string
    iban: string
}

interface AccountsState {
    accounts: Account[]
    info: string
}

class MyAccounts extends React.Component<{}, AccountsState> {

    constructor(props: any) {
        super(props);
        this.initStates();
        this.initStates = this.initStates.bind(this);
        this.handleReloadList = this.handleReloadList.bind(this);
        this.render = this.render.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        setInterval(() => this.handleReloadList(), 200);
    }

    initStates() {
        this.state = ({accounts: [], info: "init"});
        this.handleReloadList();
    }


    handleReloadList() {
        fetch("http://localhost:8080/account", {
        }).then(response => response.json().then(data => {
            console.log(data);
            this.setState({accounts: data.content});
            console.log(this.state);
        })).catch(err => {
            console.log(err);
            this.setState({info: err});
        });
    }

    handleDelete(id : string) {
        fetch("http://localhost:8080/account/" + id, {
            method: 'DELETE'
        }).then(response => response.json().then(data => {
            console.log("deleted account " + id);
            this.handleReloadList();
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
                    {this.state.accounts.map(account =>
                        <tr>
                            <td>{account.name}</td>
                            <td>{account.iban}</td>
                            <td><Button variant="outline-danger" onClick={() => this.handleDelete(account.id)}>delete</Button></td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MyAccounts;