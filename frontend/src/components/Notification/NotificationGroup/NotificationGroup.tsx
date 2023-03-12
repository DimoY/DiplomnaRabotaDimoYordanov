import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton from '@mui/joy/ListItemButton';
import Switch from '@mui/joy/Switch';
import Prop_NotificationGroup from "../../../definitions/props/Notification/Prop_NotificationGroup";
import NotificationLine from "../NotificationLine/NotificationLine";
import React from "react";
import Importance from '../../../definitions/Enums/Importance/Importance';

class NotificationGroup extends React.Component{
    constructor(props:Prop_NotificationGroup){
        super(props);
        this.state = {
            list:[],
            date:[]
        }
        let data = window.localStorage.getItem("USER_KEY")
        if(data==null){
            this.state.list = [(<h1>You are not logged in</h1>)]
        }else{
            async function getNotifications() {
                //показване на всички нотификации
                let res = await fetch("http://localhost:3333/api/notifications/",
                {
                    method:"get",
                    headers: {
                    'x-access-token': data,
                    }
                })
                if(!res.ok){
                    return
                }
                let notifications= await res.json()
                console.log(notifications)
                let item = [];
                for(const notificatiom in notifications["notifications"]){
                        let notification = notifications["notifications"][notificatiom]
                        console.log(notification)
                        item.push(
                            <ListItem key = {notificatiom}>
                                <ListItemButton>
                                    <NotificationLine start = {(new Date(notification.start)).toISOString()}
                                     end = {(new Date(notification.start+notification.times_seen)).toISOString()} 
                                     message = {notification.title} 
                                     importanceLevel = {Importance.Informative} 
                                     S3ImgKey={notification["S3ImgKey"]}/>
                                </ListItemButton>
                            </ListItem>
                        )
                        }
                this.setState({
                    list:item
                })
            }
            let getNotificationBiden = getNotifications.bind(this)
            getNotificationBiden()
        }
        
    }
    render(){
        return (
            <Box>
                <Switch
                    size="sm"
                    sx={{ mb: 2 }}
                />
                <List
                    variant="outlined"
                    sx={{
                        width: 200,
                        bgcolor: 'background.body',
                        borderRadius: 'sm',
                        boxShadow: 'sm',
                    }}
                >
                    {this.state.list}
                </List>
            </Box>
        )
    }
}
export default NotificationGroup;