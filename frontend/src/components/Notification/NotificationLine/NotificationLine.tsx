import React from "react";
import {Alert, Typography} from "@mui/joy";
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Prop_NotificationLine from "../../../definitions/props/Notification/Prop_NotificationLine";
import Importance from "../../../definitions/Enums/Importance/Importance";

class NotificationLine extends React.Component{
    constructor(props:Prop_NotificationLine) {
        super(props);
        let color:string;
        let type:string;
        let icon;
        switch (props.importanceLevel) {
            case Importance.Informative:
                color = "neutral";
                type = "soft";
                icon = <InfoIcon sx = {{mx:0.5}}/>;
                break;
            case Importance.Warning:
                color = "warning";
                type = "soft";
                icon = <NotificationImportantIcon sx = {{mx:0.5}}/>;
                break;
            case Importance.Dangerous:
                color = "danger";
                type = "soft";
                icon = <WarningIcon sx = {{mx:0.5}}/>;
                break;
            case Importance.VeryDangerous:
                color = "danger";
                type = "solid";
                icon = <WarningIcon sx = {{mx:0.5}}/>;
                break;
        }
        this.state = {
            message:props.message,
            color:color,
            type:type,
            icon:icon,
            img:props.S3ImgKey,
            from:props.start,
            end:props.end

        }
    }
    render() {
        return (
            <Alert
                startDecorator={this.state.icon}
                variant={this.state.type}
                color={this.state.color}
                endDecorator={
                    <React.Fragment>
                    </React.Fragment>
                }
            >
                <img src={"https://diplomna-rabota.s3.eu-central-1.amazonaws.com/"+this.state["img"]} alt="image" />
                <Typography sx={{ color: 'white' }} fontWeight="md">
                    {this.state.message}
                </Typography>
                <Typography sx={{ color: 'white' }} fontWeight="md">
                    Start date: {this.state.from}<br/>End date: {this.state.end}
                </Typography>
            </Alert>
        );
    }
}
export default NotificationLine