
import { TextField } from "@mui/joy";
import React from "react";

//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class CameraAddForm extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {
            setInfo:props.setInfo
        }
    }

    render() {
        return (
            <div>
                <TextField
                color="primary"
                label="Camera name"
                placeholder="Name of the camera"
                required
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                />

            </div>
        );
    }
}
export default CameraAddForm