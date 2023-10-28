import React, {useContext} from "react";
import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "../App";

export default function Usergroup() {

    const user = useContext(UserContext);

    return (
        <div>
            <InputGroup className="row mb-1">
                <InputGroupText className="col-2">Usergroup</InputGroupText>
                <Form.Select aria-label="usergroup" onChange={e => user.usergroupId = e.target.value}>
                    <option value="Administrator">Administrator</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Other">Other</option>
                </Form.Select>
            </InputGroup>
        </div>
    );
}