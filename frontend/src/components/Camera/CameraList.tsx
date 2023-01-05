import { Button } from "@mui/joy";
import React from "react";
import CameraAddForm from "./CameraAddForm";

import CameraWidget from "./CameraWidget"
//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class CameraWindow extends React.Component {
    constructor(props: {}) {
        super(props);
        this.state = {
            "list": [],
            "cameraAddFormValues":{
                "name":"",
                "ip":[0,0,0,0]
            }
        };
        async function getCameras(token: String) {

            const req = await fetch("http://localhost:3000/api/camera/get/",
                {
                    headers: {
                        "x-access-token": token
                    }
                })
            const cameras = await req.json()
            console.log(cameras)
            let list = []
            for (const camera of cameras["cameras"]) {
                list.push((
                    <CameraWidget key={camera._id} cameraName={camera.name} ip={camera.ip} dateLastStreamd={new Date(camera.updatedAt)} />
                ))
            }
            this.setState({
                "list": list
            })
        }
        let data = window.localStorage.getItem("USER_KEY")
        if (data == null) {
            this.state.list = [(<h1>You are not logged in</h1>)]
        } else {
            let getCamerasBiden = getCameras.bind(this)
            getCamerasBiden(data)
        }


    }
    addNewCamera(e:any){
        console.log(e)
    }
    render() {
        return (
            <div>
                <CameraAddForm/>
                <Button color="primary" onClick={this.addNewCamera} >Add new camera</Button>
                <div>{this.state["list"]}</div>
            </div>
        );
    }
}
export default CameraWindow