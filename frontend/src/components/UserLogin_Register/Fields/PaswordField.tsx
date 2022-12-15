import React from "react";
import {TextField} from "@mui/joy";


class PasswordField extends React.Component{
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
                />
            </div>
        );
    }
}
export default PasswordField