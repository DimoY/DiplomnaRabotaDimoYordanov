import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton from '@mui/joy/ListItemButton';
import Switch from '@mui/joy/Switch';
import Prop_NotificationGroup from "../../../definitions/props/Notification/Prop_NotificationGroup";
import NotificationLine from "../NotificationLine/NotificationLine";
import React from "react";

class NotificationGroup extends React.Component{
    constructor(props:Prop_NotificationGroup){
        super(props);
        this.state = {
            list:[],
            date:[]
        }
        for(const KeyValuePair of this.props.data.entries()){
            let item = [];
            for (const listItem of KeyValuePair[1]){
                item.push(
                    <ListItem>
                        <ListItemButton>
                            <NotificationLine message = {listItem.message} importanceLevel = {listItem.importanceLevel}/>
                        </ListItemButton>
                    </ListItem>
                )
            }
            this.state.date.push(new Date(KeyValuePair[0]))
            let value = (
                    <ListItem nested>
                        <ListSubheader>{KeyValuePair[0]}</ListSubheader>
                        <List>
                            {item}
                        </List>
                    </ListItem>
                );

            this.state.list=value
        }
    }
    render(){
        return (
            <Box>
                <Switch
                    size="sm"
                    // checked={small}
                    // onChange={(event) => setSmall(event.target.checked)}=
                    sx={{ mb: 2 }}
                />
                <List
                    variant="outlined"
                    // size={small ? 'sm' : undefined}
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