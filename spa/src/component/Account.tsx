import React, {useContext} from "react";
import {starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "../App";


export default function Account() {

    const user = useContext(UserContext);
    const [name, setName] = React.useState<string>(randomName);
    const [iban, setIban] = React.useState<string>(randomIban);
    const [info, setInfo] = React.useState<string>("init");

    function randomIban(): string {
        return `AT${Math.floor(Math.random() * 10000000000000000)}`;
    }

    function randomName() {
        return uniqueNamesGenerator({
            dictionaries: [starWars]
        });
    }

    function regenerate() {
        setName(randomName());
        setIban(randomIban());
    }

    function handleSubmit() {
        console.log("post account:");

        fetch("http://localhost:8080/account", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, iban: iban, usergroupId: user.usergroupId})
        })
            .then(response => response.json().then(data => {
                setInfo("created id: " + data.id);
            }))
            .catch(err => setInfo("error" + err.toString()))
        regenerate();
    }

    return <div>
        <h4>Account</h4>
        <Form className="mb-1 mx-2">
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Name</InputGroupText>
                <Form.Control className="col" value={name} onChange={e => setName(e.target.value)}/>
            </InputGroup>
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Iban</InputGroupText>
                <Form.Control className="col" value={iban}
                              onChange={e => setIban(e.target.value)}/>
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
