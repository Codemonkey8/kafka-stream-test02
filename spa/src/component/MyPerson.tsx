import React from "react";
import {Config, starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

const customConfig: Config = {
    dictionaries: [starWars],
    separator: '-',
    length: 2,
};

interface Person {
    name: string
    age: number
}

interface PersonState {
    person: Person
    info: string
}

class MyPerson extends React.Component<{}, PersonState> {

    constructor(props: any) {
        super(props);
        this.initStates();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initStates = this.initStates.bind(this);
        this.regenerate = this.regenerate.bind(this);
        this.setInfo = this.setInfo.bind(this);
    }

    initStates() {
        const randomName: string = uniqueNamesGenerator({
            dictionaries: [starWars]
        });
        const randomAge: number = this.getRandomInt(18, 100);
        this.state = ({person: {name: randomName, age: randomAge}, info: "init"});
    }

    regenerate() {
        const randomName: string = uniqueNamesGenerator({
            dictionaries: [starWars]
        });
        const randomAge: number = this.getRandomInt(18, 100);
        this.setState({person: {name: randomName, age: randomAge}});
    }

    getRandomInt(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    handleSubmit() {
        console.log("post person:");
        console.log(this.state.person);


        fetch("http://localhost:8080/person", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.person)
        })
            .then(response => response.json().then(data => {
                this.setInfo("created id: " + data.id);
            }))
            .catch(err => this.setInfo("error" + err.toString()))
        this.regenerate();
    }

    setName(name: string) {
        this.setState({person: {name: name, age: this.state.person.age}});
    }

    setAge(age: number) {
        this.setState({person: {name: this.state.person.name, age: age}});
    }

    setInfo(err: string) {
        console.log(err);
        this.setState({info: err});
    }

    render() {
        return <div>
            <h4>Person</h4>
            <Form className="mb-1">
                <InputGroup className="row mb-1">
                    <InputGroupText className="col-2">Name</InputGroupText>
                    <Form.Control className="col" value={this.state.person.name}
                                  onChange={event => this.setName(event.target.value)}
                    />
                </InputGroup>
                <InputGroup className="row mb-1">
                    <InputGroupText className="col-2">Iban</InputGroupText>
                    <Form.Control className="col" value={this.state.person.age}
                                  onChange={event => this.setAge(parseInt(event.target.value))}
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

export default MyPerson;