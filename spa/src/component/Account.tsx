import React, {useContext} from "react";
import {starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "../App";

interface Account {
    name: string
    iban: string
}

interface AccountRto extends Account {
    usergroupId: string
}

function randomIban(): string {
    return `AT${Math.floor(Math.random() * 10000000000000000)}`;
}

function randomName() {
    return uniqueNamesGenerator({
        dictionaries: [starWars]
    });
}

function randomAccount() {
    return {name: randomName(), iban: randomIban()};
}

export default function Account() {

    const user = useContext(UserContext);
    const [account, setAccount] = React.useState<Account>(randomAccount());
    const [info, setInfo] = React.useState<string>("init");

    function handleSubmit() {
        console.log("post account:");
        console.log(account);

        let rto = account as AccountRto;
        rto.usergroupId = user.usergroupId;

        fetch("http://localhost:8080/account", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(rto)
        })
            .then(response => response.json().then(data => {
                setInfo("created id: " + data.id);
            }))
            .catch(err => setInfo("error" + err.toString()))
        regenerate();
    }

    function regenerate() {
        setAccount(randomAccount());
    }

    return <div>
        <h4>Account</h4>
        <Form className="mb-1 mx-2">
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Name</InputGroupText>
                <Form.Control className="col" value={account.name}
                              onChange={event => {
                                  account.name = event.target.value;
                                  setAccount(account);
                              }
                              }
                />
            </InputGroup>
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Iban</InputGroupText>
                <Form.Control className="col" value={account.iban}
                              onChange={event => account.iban = event.target.value}
                />
            </InputGroup>
            <ButtonGroup aria-label="Basic example" className="mb-1">
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                <Button variant="secondary" onClick={regenerate}>Regenerate</Button>
            </ButtonGroup>
            <Alert variant="info" className="row">
                {info}
            </Alert>
        </Form>
    </div>;
}
