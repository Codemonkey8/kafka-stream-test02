import React, {useContext} from "react";
import {starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "../App";


export default function Person() {

    const user = useContext(UserContext);
    const [name, setName] = React.useState<string>(randomName);
    const [age, setAge] = React.useState<number>(randomAge);
    const [info, setInfo] = React.useState<string>("init");

    function randomName() {
        return uniqueNamesGenerator({
            dictionaries: [starWars]
        });
    }

    function randomAge() {
        return 1 + Math.floor(Math.random() * 99);
    }

    function handleSubmit() {
        console.log("post person:");

        fetch("http://localhost:8080/person", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, age: age, usergroupId: user.usergroupId})
        })
            .then(response => response.json().then(data => {
                setInfo("created id: " + data.id);
            }))
            .catch(err => setInfo("error" + err.toString()))
        regenerate();
    }

    function regenerate() {
        setName(randomName());
        setAge(randomAge());
    }

    return <div>
        <h4>Person</h4>
        <Form className="mb-1 mx-2">
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Name</InputGroupText>
                <Form.Control className="col" value={name} onChange={e => setName(e.target.value)}/>
            </InputGroup>
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Iban</InputGroupText>
                <Form.Control className="col" type={"number"} value={age}
                              onChange={e => setAge(parseInt(e.target.value))}/>
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
