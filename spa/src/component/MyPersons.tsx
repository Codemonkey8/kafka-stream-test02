import React, {useEffect} from "react";
import {Config, starWars, uniqueNamesGenerator} from 'unique-names-generator';
import {Alert, Button, ButtonGroup, Form, InputGroup, ListGroup, Table} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";


interface Person {
    id: string
    name: string
    age: number
}

interface PersonsState {
    persons: Person[]
    info: string
}

class MyPersons extends React.Component<{}, PersonsState> {

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
        this.state = ({persons: [], info: "init"});
        this.handleReloadList();
    }


    handleReloadList() {
        fetch("http://localhost:8080/person", {
        }).then(response => response.json().then(data => {
            console.log(data);
            this.setState({persons: data.content});
            console.log(this.state);
        })).catch(err => {
            console.log(err);
            this.setState({info: err});
        });
    }

    handleDelete(id : string) {
        fetch("http://localhost:8080/person/" + id, {
            method: 'DELETE'
        }).then(response => response.json().then(data => {
            console.log("deleted person " + id);
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
                    {this.state.persons.map(person =>
                        <tr>
                            <td>{person.name}</td>
                            <td>{person.age}</td>
                            <td><Button variant="outline-danger" onClick={() => this.handleDelete(person.id)}>delete</Button></td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MyPersons;