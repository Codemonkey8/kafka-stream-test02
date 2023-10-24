import React from "react";
import {Button, Table} from "react-bootstrap";
import {Client} from '@stomp/stompjs';


interface Account {
    id: string
    name: string
    iban: string
}

interface AccountsState {
    accounts: Account[]
    info: string
}

class MyAccounts extends React.Component<{}, AccountsState> {

    private client: Client = new Client;

    constructor(props: any) {
        super(props);
        this.initStates();
        this.initStates = this.initStates.bind(this);
        this.handleReloadList = this.handleReloadList.bind(this);
        this.render = this.render.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        // setInterval(() => this.handleReloadList(), 200);
    }

    initStates() {
        this.state = ({accounts: [], info: "init"});
    }

    componentDidMount() {
        this.handleReloadList();
        this.client.configure({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('onConnect');
                this.client.subscribe('/topic/account', (message: { body: any; }) => {
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
        fetch("http://localhost:8080/account", {}).then(response => response.json().then(data => {
            console.log(data);
            this.setState({accounts: data.content});
            console.log(this.state);
        })).catch(err => {
            console.log(err);
            this.setState({info: err});
        });
    }

    handleDelete(id: string) {
        fetch("http://localhost:8080/account/" + id, {
            method: 'DELETE'
        }).then(response => response.json().then(data => {
            console.log("deleted account " + id);
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
                    {this.state.accounts.map(account =>
                        <tr key={account.id}>
                            <td>{account.name}</td>
                            <td>{account.iban}</td>
                            <td><Button variant="outline-danger"
                                        onClick={() => this.handleDelete(account.id)}>delete</Button></td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MyAccounts;