import React, {FormEvent} from "react";
import PaswordField from "../Fields/PaswordField";
import UsernameField from "../Fields/UsernameField";
import SubmitButton from "../Fields/SubmitButton";
import {Typography} from "@mui/joy";

class LoginForm extends React.Component{
    constructor(props:{}) {
        super(props);
        this.state = {
            "username":"",
            "password":"password"
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setUsername = this.setUsername.bind(this) 
        this.setPassword = this.setPassword.bind(this) 
    }
    handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault()
        const body = JSON.stringify({
            "username":this.state["username"],
            "password":this.state["password"]
        })
        let res = fetch("http://localhost:3333/api/user/login/",
            {
                method:"post",
                headers: {
                  'content-type': 'application/json;charset=UTF-8',
                },
                body:body
            }
        ).then(async function(e){
            if (!e.ok){
                console.log("Fetching error")
            }
            let data = await e.json()
            window.localStorage.setItem("USER_KEY",data["user"])
        })
    }
    setUsername(val:String){
        this.setState({
            "username":val
        })
    }
    setPassword(val:String){
        this.setState({
            "password":val
        })
    }
    render() {
        return (
            <div className ="UserInfo">


                <form onSubmit={this.handleSubmit}>
                    <Typography mb={2}  lineHeight="lg">
                        Login
                    </Typography>
                    <UsernameField textChange = {this.setUsername} />
                    <PaswordField textChange = {this.setPassword}/>
                    <SubmitButton/>
                </form>
            </div>
        );
    }
}
export default LoginForm