import React, {FormEvent} from "react";
import PaswordField from "../Fields/PaswordField";
import UsernameField from "../Fields/UsernameField";
import SubmitButton from "../Fields/SubmitButton";
import {Typography} from "@mui/joy";
import EmailField from "../Fields/EmailField";

class RegisterForm extends React.Component{
    constructor(props:{}) {
        super(props);
        this.state = {
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault()
        console.log(e)
    }
    render() {
        return (
            <div className ="UserInfo">
                <Typography mb={2}  lineHeight="lg">
                    Register
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <UsernameField/>
                    <EmailField/>
                    <PaswordField/>
                    <SubmitButton/>
                </form>
            </div>
        );
    }
}
export default RegisterForm