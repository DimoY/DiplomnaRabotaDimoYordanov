//

import React from "react";

import FaceWidget from "./FaceWidget"
//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class FaceWindow extends React.Component {
    constructor(props:{}) {
        super(props);
        this.state = {
            "list":[]
        };
        async function getFaces(token:String){
            
            const req = await fetch("http://localhost:3000/api/face/get/",
            {
                headers:{
                    "x-access-token":token
                }
            })
            const faces = await req.json()
            console.log(faces)
            let list = []
            for(const face of faces["faces"]){
                list.push((
                    <FaceWidget key = {face._id} faceName = {face.personName} faceUrl = {"https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"} />
                ))
            }
            this.setState({
                "list":list
            })
        }
        let data = window.localStorage.getItem("USER_KEY")
        if(data==null){
            this.setState({
                "list":[(<h1>You are not logged in</h1>)]
            })
        }else{
            let getFacesBiden = getFaces.bind(this)
            getFacesBiden(data)
        }
        

    }
    render() {
        return (
                <div>{this.state["list"]}</div>
            );
    }
}
export default FaceWindow