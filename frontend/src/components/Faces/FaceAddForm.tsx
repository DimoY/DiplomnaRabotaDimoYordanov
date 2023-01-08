
import { TextField,Input } from "@mui/joy";
import React from "react";

//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class FaceAddForm extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {
            setName:props.setName,
            setFile:props.setFile
        }
    }

    render() {
        return (
            <div>
                <TextField
                color="primary"
                label="Person name"
                placeholder="Name of the person"
                required
                onChange={(e)=>{this.state.setName(e)}}
                />
                <Input placeholder="Type in here…" variant="plain" type = "file" onChange={(e)=>{this.state.setFile(e)}} />

            </div>
        );
    }
}
export default FaceAddForm