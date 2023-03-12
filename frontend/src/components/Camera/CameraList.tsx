import { Button, Stack } from "@mui/joy";
import React from "react";
import CameraAddForm from "./CameraAddForm";

import CameraWidget from "./CameraWidget"
//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class CameraWindow extends React.Component {
    async getCameras(token: String) {
        //код за взимане на всички камери
        const req = await fetch("http://localhost:3333/api/camera/get/",
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
                <CameraWidget key={camera._id} cameraName={camera.name} ip={camera.ip} id={camera._id} dateLastStreamd={new Date(camera.updatedAt)} />
            ))
        }
        this.setState({
            "list": list
        })
    }
    constructor(props: {}) {
        super(props);
        this.state = {
            "list": [],
            "form-name":"",
            "form-ip":[0,0,0,0],
            "form-cameraType":"outside",
            "form-maskRecognition":false,
            "form-faceRecognition":false

        };
        
        let data = window.localStorage.getItem("USER_KEY")
        if (data == null) {
            this.state.list = [(<h1>You are not logged in</h1>)]
        } else {
            let getCamerasBiden = this.getCameras.bind(this)
            getCamerasBiden(data)
        }


    }
    infoChange(e){
        let name:String = e["type"]
        let value:String = e["value"]
        if(name == "name"){
            this.setState({
                "form-name":value
            })
        }else if(name == "cameraType"){
            this.setState({
                "form-cameraType":value
            })
        }else if(name == "faceRecognition"){
            this.setState({
                "form-faceRecognition":value
            })
        }else if(name == "maskRecognition"){
            this.setState({
                "form-maskRecognition":value
            })
        }
        else{
            
            let val = this.state["form-ip"]
            val[Number.parseInt(name[2])] =Number.parseInt(value)
            this.setState({
                "form-ip":val
            })
        }
    }
    addNewCamera(e:any){
        // код за добавяне на камера за даден потребител
        async function addCameras(token: String) {
            const req = await fetch("http://localhost:3333/api/camera/add/",
                    {
                        method:"post",
                        headers: {
                            "x-access-token": token,
                            "content-type":"application/json"
                        },
                        body:JSON.stringify({
                                "cameraName":this.state["form-name"],
	                            "ip":this.state["form-ip"],
                                "cameraType":this.state["form-cameraType"],
                                "enableFace":this.state["form-maskRecognition"],
                                "enableMask":this.state["form-faceRecognition"]
                            
                        })
                    })
            const cameras = await req.json()
            console.log(cameras)
            this.getCameras(token)
        }
        let data = window.localStorage.getItem("USER_KEY")
        if (data != null) {
            addCameras.bind(this)(data)
        }

        
            
        
    }
    render() {
        return (
            <div>
                <CameraAddForm setInfo = {this.infoChange.bind(this)}/>
                <Button color="primary" onClick={this.addNewCamera.bind(this)} >Add new camera</Button>
                
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    {this.state["list"]}
                </Stack>
            </div>
        );
    }
}
export default CameraWindow