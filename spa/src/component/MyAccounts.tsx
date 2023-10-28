import React, {useEffect} from "react";
import {Button, Table} from "react-bootstrap";
import {useSubscription} from "react-stomp-hooks";

interface Account {
    id: string
    name: string
    iban: string
    usergroupId: string
}

export default function MyAccounts() {

    const [accounts, setAccounts] = React.useState<Account[]>([]);

    useEffect(() => {
        console.log("useEffect")
        loadAccounts();
    }, []);

    useSubscription("/topic/account", (message) => {
        console.log("received account event message: " + message.body);
        loadAccounts();
    });

    function loadAccounts() {
        fetchAccounts().then(result => setAccounts(result))
    }

    async function fetchAccounts() {
        console.log("fetchAccounts")
        try {
            const response = await fetch("http://localhost:8080/account", {});
            const data = await response.json();
            return data.content as Account[];
        } catch (err) {
            console.log(err);
            return [] as Account[];
        }
    }

    function handleDelete(account: Account) {
        fetch("http://localhost:8080/account", {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(account)
        }).then(() => {
            console.log("deleted account " + account.id);
            loadAccounts();
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
                    <th>iban</th>
                </tr>
                </thead>
                <tbody>
                {accounts.map(account =>
                    <tr key={account.id}>
                        <td>{account.usergroupId}</td>
                        <td>{account.name}</td>
                        <td>{account.iban}</td>
                        <td><Button variant="outline-danger"
                                    onClick={() => handleDelete(account)}>delete</Button></td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}