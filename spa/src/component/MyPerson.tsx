import React, {useContext} from "react";
import {starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "../App";

interface Person {
    name: string
    age: number
}

interface PersonRto extends Person {
    usergroupId: string
}

function randomAge() {
    return 1 + Math.floor(Math.random() * 99);
}

function randomName() {
    return uniqueNamesGenerator({
        dictionaries: [starWars]
    });
}

function randomPerson() {
    return {name: randomName(), age: randomAge()};
}

export default function MyPerson() {

    const user = useContext(UserContext);
    const [person, setPerson] = React.useState<Person>(randomPerson());
    const [info, setInfo] = React.useState<string>("init");

    function handleSubmit() {
        console.log("post person:");
        console.log(person);

        let rto = person as PersonRto;
        rto.usergroupId = user.usergroupId;

        fetch("http://localhost:8080/person", {
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
        setPerson(randomPerson());
    }

    return <div>
        <h4>Person</h4>
        <Form className="mb-1 mx-2">
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Name</InputGroupText>
                <Form.Control className="col" value={person.name}
                              onChange={event => {
                                  person.name = event.target.value;
                                  setPerson(person);
                              }
                              }
                />
            </InputGroup>
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Iban</InputGroupText>
                <Form.Control className="col" value={person.age}
                              onChange={event => person.age = parseInt(event.target.value)}
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
