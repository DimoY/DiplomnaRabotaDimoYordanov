import React from "react";
import {TextField} from "@mui/joy";


class PasswordField extends React.Component{
    constructor(props:{}) {
        super(props);
        this.state = {
            "setPassword":props.textChange
        }
    }
    render() {
        return (
            <div>
                <TextField
                    color="primary"
                    label="Password:"
                    placeholder="Your password ..."
                    size="md"
                    variant="soft"
                    type="password"
                    onChange={(e)=>{this.state["setPassword"](e.target.value)}}
                />
            </div>
        );
    }
}
export default PasswordField