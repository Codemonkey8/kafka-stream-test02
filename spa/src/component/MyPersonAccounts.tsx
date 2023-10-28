import React, {useEffect} from "react";
import {Table} from "react-bootstrap";
import {useSubscription} from "react-stomp-hooks";


interface PersonAccount {
    id: string
    accountId: string;
    accountName: string;
    iban: string;
    personId: string;
    personName: string;
    age: number;
    usergroupId: string
}

export default function MyPersonAccounts() {

    const [personAccounts, setPersonAccounts] = React.useState<PersonAccount[]>([]);

    useEffect(() => {
        console.log("useEffect")
        loadPersonAccounts();
    }, []);

    useSubscription("/topic/person-accounts", (message) => {
        console.log("received personAccount event message: " + message.body);
        loadPersonAccounts();
    });

    function loadPersonAccounts() {
        fetchPersonAccounts().then(result => setPersonAccounts(result))
    }

    async function fetchPersonAccounts() {
        console.log("fetchPersonAccounts")
        try {
            const response = await fetch("http://localhost:8080/personAccount", {});
            const data = await response.json();
            return data.content as PersonAccount[];
        } catch (err) {
            console.log(err);
            return [] as PersonAccount[];
        }
    }

    return (
        <div>
            <h4>Person-Accounts</h4>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>user-name</th>
                    <th>age</th>
                    <th>usergroup</th>
                    <th>account-name</th>
                    <th>iban</th>
                </tr>
                </thead>
                <tbody>
                {personAccounts.map(personAccount =>
                    <tr key={personAccount.id}>
                        <td>{personAccount.personName}</td>
                        <td>{personAccount.age}</td>
                        <td>{personAccount.usergroupId}</td>
                        <td>{personAccount.accountName}</td>
                        <td>{personAccount.iban}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}