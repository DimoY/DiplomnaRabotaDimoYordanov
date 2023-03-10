import React, {FormEvent} from "react";
import PaswordField from "../Fields/PaswordField";
import UsernameField from "../Fields/UsernameField";
import SubmitButton from "../Fields/SubmitButton";
import {Typography} from "@mui/joy";
import EmailField from "../Fields/EmailField";
var sha256 = require('js-sha256');

class RegisterForm extends React.Component{
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
        // компонент за управление на формата при натискане за регистриране
        const body = JSON.stringify({
            "username":this.state["username"],
            "password":sha256(this.state["password"])
        })
        let res = fetch("http://localhost:3333/api/user/register/",
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
                <Typography mb={2}  lineHeight="lg">
                    Register
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <UsernameField textChange = {this.setUsername} />
                    <PaswordField textChange = {this.setPassword} />
                    <SubmitButton/>
                </form>
            </div>
        );
    }
}
export default RegisterForm