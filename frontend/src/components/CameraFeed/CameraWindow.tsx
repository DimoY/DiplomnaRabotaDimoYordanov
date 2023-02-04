import React from "react";
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import sharp from "sharp"


class CameraWindow extends React.Component{
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {

        };
    }
    render(){
        return (
            <Card variant="outlined" component="li" sx={{minWidth: 512, minHeight:360 }}>

                    <CardCover>
                        <video
                            autoPlay
                            loop
                            muted>
                            <source src="https://www.w3docs.com/build/videos/arcnet.io(7-sec).mp4" type="video/mp4"/>
                        </video>
                        </CardCover>
                </Card>
        )
    }
}
export default  CameraWindow