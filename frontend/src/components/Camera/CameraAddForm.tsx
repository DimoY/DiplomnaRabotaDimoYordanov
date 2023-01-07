
import { TextField } from "@mui/joy";
import React from "react";

//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class CameraAddForm extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {
            setInfo:props.setInfo,
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
                onChange={(e)=>{this.state.setInfo({"type":"name","value":e.target.value})}}
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                onChange={(e)=>{this.state.setInfo({"type":"ip0","value":e.target.value})}}
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                onChange={(e)=>{this.state.setInfo({"type":"ip1","value":e.target.value})}}
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                onChange={(e)=>{this.state.setInfo({"type":"ip2","value":e.target.value})}}
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                onChange={(e)=>{this.state.setInfo({"type":"ip3","value":e.target.value})}}
                />

            </div>
        );
    }
}
export default CameraAddForm