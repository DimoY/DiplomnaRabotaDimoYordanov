import React from "react";
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Button from '@mui/joy/Button';
import useWebSocket from 'react-use-websocket';

function CameraWindow({ props }) {
    const WS_URL = 'ws://127.0.0.1:3333/stream/63dd2ce9cd677ca7fa80d4a4';
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

    const [messageHistory, setMessageHistory] = React.useState([]);

    const activeImageChange = ()=>{
        sendMessage("s")
        if(lastMessage!=null){
            const msg = JSON.parse(lastMessage["data"])
            createImageBitmap(new Blob(msg["data"]),0,0,msg["size"][0],msg["size"][1]).then((data)=>{
                console.log(data)

            })
            
        }
        
    }

    return (
        <div>
            <Button onClick={()=>{
            setTimeout(()=>{activeImageChange()}, 500)
            
        }}>
            See live
        </Button>
        <Card variant="outlined" component="li" sx={{minWidth: 512, minHeight:360 }}>
                
                <CardCover>
                    
                    </CardCover>
            </Card>
        </div>
        
    )
}

export default CameraWindow