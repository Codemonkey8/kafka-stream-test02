import React from "react";
import {Client} from '@stomp/stompjs';
import {Table} from "react-bootstrap";

interface PersonAccount {
    id: string
    accountId: string;
    accountName: string;
    iban: string;
    personId: string;
    personName: string;
    age: number;
}

interface PersonAccountState {
    personAccounts: PersonAccount[]
    info: string
}

class MyPersonAccount extends React.Component<{}, PersonAccountState> {

    private client: Client = new Client;

    constructor(props: any) {
        super(props);
        this.initStates();
        this.initStates = this.initStates.bind(this);
        this.handleReloadList = this.handleReloadList.bind(this);
        this.render = this.render.bind(this);
        // setInterval(() => this.handleReloadList(), 200);
    }

    initStates() {
        this.state = ({personAccounts: [], info: "init"});

    }

    componentDidMount() {
        this.handleReloadList();
        this.client.configure({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('onConnect');
                this.client.subscribe('/topic/person-accounts', (message: { body: any; }) => {
                    console.log(message.body);
                    this.handleReloadList();
                });
            },
            // Helps during debugging, remove in production
            debug: (str: any) => {
                console.log(new Date(), str);
            }
        });
        this.client.activate();
    }


    handleReloadList() {
        fetch("http://localhost:8080/personAccount", {}).then(response => response.json().then(data => {
            console.log(data);
            this.setState({personAccounts: data.content});
            console.log(this.state);
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
                <h4>Person-Account</h4>
                {/*<Button variant="info" onClick={() => this.handleReloadList()}>reload</Button>*/}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>user-name</th>
                        <th>age</th>
                        <th>account-name</th>
                        <th>iban</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.personAccounts.map(person =>
                        <tr key={person.id}>
                            <td>{person.personName}</td>
                            <td>{person.age}</td>
                            <td>{person.accountName}</td>
                            <td>{person.iban}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MyPersonAccount;