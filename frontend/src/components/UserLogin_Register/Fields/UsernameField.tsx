import React from "react";
import {TextField} from "@mui/joy";


class UsernameField extends React.Component{
    constructor(props:{}) {
        super(props);
        this.state = {
            "setUsername":props.textChange
        }
    }
    render() {
        return (
            <div>
                <TextField
                    color="primary"
                    label="Username:"
                    placeholder="Your username ..."
                    size="md"
                    variant="soft"
                    onChange={(e)=>{this.state["setUsername"](e.target.value)}}
                />
            </div>
        );
    }
}
export default UsernameField