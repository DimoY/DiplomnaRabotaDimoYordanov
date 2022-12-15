import React from "react";
import {TextField} from "@mui/joy";


class EmailField extends React.Component{
    render() {
        return (
            <div>
                <TextField
                    color="primary"
                    label="Email:"
                    placeholder="Your email ..."
                    size="md"
                    variant="soft"
                    type="email"
                />
            </div>
        );
    }
}
export default EmailField