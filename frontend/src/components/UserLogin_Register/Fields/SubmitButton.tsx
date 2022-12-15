import React from "react";
import {Button} from "@mui/joy";


class SubmitButton extends React.Component{
    render() {
        return (
            <div>
                <Button
                    color="primary"
                    size="md"
                    variant="soft"
                    type="submit"
                >Submit</Button>
            </div>
        );
    }
}
export default SubmitButton