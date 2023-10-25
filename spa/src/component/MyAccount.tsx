import React from "react";
import {names, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

interface Account {
    name: string
    iban: string
}

interface AccountState {
    account: Account
    info: string
}

class MyAccount extends React.Component<{}, AccountState> {

    constructor(props: any) {
        super(props);
        this.initStates();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initStates = this.initStates.bind(this);
        this.regenerate = this.regenerate.bind(this);
        this.setInfo = this.setInfo.bind(this);
    }

    private initStates() {
        this.state = ({account: {name: this.randomName(), iban: this.randomIban()}, info: "init"});
    }

    private regenerate() {
        this.setState({account: {name: this.randomName(), iban: this.randomIban()}});
    }

    private randomName(): string {
        return uniqueNamesGenerator({dictionaries: [names]});
    }

    private randomIban(): string {
        return "AT" + Math.floor(Math.random() * 10000000000000000);
    }

    private handleSubmit() {
        console.log("post account:");
        console.log(this.state.account);
        this.setInfo("posting account");
        fetch("http://localhost:8080/account", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.account)
        })
            .then(response => response.json().then(data => {
                this.setInfo("created id: " + data.id);
            }))
            .catch(err => this.setInfo("error" + err.toString()))
        this.regenerate();
    }

    private setName(name: string) {
        this.state.account.name = name;
        this.forceUpdate();
    }

    private setIban(iban: string) {
        this.state.account.iban = iban;
        this.forceUpdate();
    }

    private setInfo(err: string) {
        console.log(err);
        this.setState({info: err});
    }

    render() {
        return <div>
            <h4>Account</h4>
            <Form className="mb-1">
                <InputGroup className="row mb-1">
                    <InputGroupText className="col-2">Name</InputGroupText>
                    <Form.Control className="col" value={this.state.account.name}
                                  onChange={event => this.setName(event.target.value)}
                    />
                </InputGroup>
                <InputGroup className="row mb-1">
                    <InputGroupText className="col-2">Iban</InputGroupText>
                    <Form.Control className="col" value={this.state.account.iban}
                                  onChange={event => this.setIban(event.target.value)}
                    />
                </InputGroup>
                <ButtonGroup aria-label="Basic example" className="mb-1">
                    <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                    <Button variant="secondary" onClick={this.regenerate}>Regenerate</Button>
                </ButtonGroup>
                <Alert variant="info" className="row">
                    {this.state.info}
                </Alert>
            </Form>
        </div>
            ;

    }

}

export default MyAccount;
