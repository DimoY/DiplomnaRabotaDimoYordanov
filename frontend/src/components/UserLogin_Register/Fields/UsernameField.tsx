import React from "react";
import {TextField} from "@mui/joy";


class UsernameField extends React.Component{
    render() {
        return (
            <div>
                <TextField
                    color="primary"
                    label="Username:"
                    placeholder="Your username ..."
                    size="md"
                    variant="soft"
                />
            </div>
        );
    }
}
export default UsernameField