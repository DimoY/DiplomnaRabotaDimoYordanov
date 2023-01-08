import React from "react";
import LoginForm from "./LoginForm/LoginForm";
import RegisterForm from "./RegisterForm/RegisterForm";

class UserAuthWidget extends React.Component{
    constructor(props:{}) {
        super(props)

        this.state = {
            registerWidget:(<div><RegisterForm/><br/><br/><LoginForm/></div>),
            getInfoAndRemove:()=>{
                window.localStorage.removeItem("USER_KEY")
                return "Logout"
            }
        }
    }
    
    render() {

        return (
            <div>
                {window.localStorage.getItem("USER_KEY") == null? this.state.registerWidget : this.state.getInfoAndRemove()}
            </div>
        );
    }
}
export default UserAuthWidget