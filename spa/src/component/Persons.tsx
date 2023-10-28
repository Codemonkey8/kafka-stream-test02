import React, {useEffect} from "react";
import {Button, Table} from "react-bootstrap";
import {useSubscription} from "react-stomp-hooks";

interface Person {
    id: string
    name: string
    age: number
    usergroupId: string
}

export default function Persons() {

    const [persons, setPersons] = React.useState<Person[]>([]);

    useEffect(() => {
        console.log("useEffect")
        loadPersons();
    }, []);

    useSubscription("/topic/person", (message) => {
        console.log("received person event message: " + message.body);
        loadPersons();
    });

    function loadPersons() {
        fetchPersons().then(result => setPersons(result))
    }

    async function fetchPersons() {
        console.log("fetchPersons")
        try {
            let response = await fetch("http://localhost:8080/person", {});
            let data: any = await response.json();
            return data.content as Person[]
        } catch (err) {
            console.log(err);
            return [] as Person[];
        }
    }

    function handleDelete(person: Person) {
        fetch("http://localhost:8080/person", {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(person)
        }).then(() => {
            console.log("deleted person " + person.id);
            loadPersons();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>usergroup</th>
                    <th>name</th>
                    <th>age</th>
                </tr>
                </thead>
                <tbody>
                {persons.map(person =>
                    <tr key={person.id}>
                        <td>{person.usergroupId}</td>
                        <td>{person.name}</td>
                        <td>{person.age}</td>
                        <td><Button variant="outline-danger"
                                    onClick={() => handleDelete(person)}>delete</Button></td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}