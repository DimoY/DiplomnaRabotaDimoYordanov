//

import React from "react";

import FaceWidget from "./FaceWidget"
import FaceAddForm from "./FaceAddForm";
import { Button, Stack } from "@mui/joy";
import FaceSensitivitySidebar from "./SensitivitySidebar"
//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class FaceWindow extends React.Component {
    async getFaces(token:String){
        // код за вземане на лица на даден потребител
        const req = await fetch("http://localhost:3333/api/face/get/",
        {
            headers:{
                "x-access-token":token
            },
            mode:"cors"
        })
        const faces = await req.json()
        let list = []
        for(const face of faces["faces"]){
            const image_url = "https://diplomna-rabota.s3.eu-central-1.amazonaws.com/"+face["face"][0].pictureAt
            list.push((
                <FaceWidget key = {face._id} faceName = {face.personName} faceUrl = {image_url} num={face["face"].length}/>
            ))
        }
        this.setState({
            "list":list
        })
    }
    constructor(props:{}) {
        super(props);
        this.state = {
            "list":[],
            "name":"",
            "file":""
        };
        
        let data = window.localStorage.getItem("USER_KEY")
        if(data==null){
            this.setState({
                "list":[(<h1>You are not logged in</h1>)]
            })
        }else{
            this.getFaces(data)
        }
        

    }
    handleFile(e){
        var reader = new FileReader();
        reader.onload = (evt) => {
            if(evt.target == undefined){
                return
            }
            let arrBuff = evt.target.result
            this.setState({
                "file":new Uint8Array(arrBuff)
            })
            
        };
        reader.readAsArrayBuffer(e);
        
    }
    handleAddFace(e){
        async function addFace(token: String) {
            // добавяне на лице чрез програмния интерфейс
            const body = JSON.stringify({
                "faceArray":this.state["file"],
                "personName":this.state["name"]
            
        })
            const req = await fetch("http://localhost:3333/api/face/add/browser/",
                    {
                        method:"post",
                        mode:"cors",
                        headers: {
                            "x-access-token": token,
                            "content-type":"application/json"
                        },
                        body:body
                    })
            const face = await req.json()
            this.getFaces(token)
        }
        let data = window.localStorage.getItem("USER_KEY")
        if (data != null) {
            addFace.bind(this)(data)
        }
    }
    render() {
        return (
                <div>

                    <FaceSensitivitySidebar/>
                    <br/>
                    <FaceAddForm setName = {
                        ((e)=>{this.setState({
                        "name":e.target.value
                    })
                    }).bind(this)}
                        setFile = {
                            ((e)=>{
                                this.handleFile(e.target.files[0])
                                
                            }).bind(this)
                        }
                    />
                    <Button color="primary" onClick={((e)=>{
                        this.handleAddFace(e)
                    }).bind(this)} >Add new face</Button>
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
export default FaceWindow