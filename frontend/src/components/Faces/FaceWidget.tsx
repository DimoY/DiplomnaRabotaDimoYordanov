import React from "react";
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Prop_FaceWidget from "../../definitions/props/Faces/Prop_FaceWidget";


class FaceWidget extends React.Component {
    constructor(props: Prop_FaceWidget) {
        super(props);
        this.state = {
            "name": props.faceName,
            "url": props.faceUrl
        };
    }
    render() {
        return (
                <Card variant="outlined" sx={{ width: 320 }}>
                    <CardOverflow>
                        <AspectRatio ratio="2">
                            <img
                                src={this.state["url"]}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>
                    </CardOverflow>
                    <Typography level="h2" sx={{ fontSize: 'md', mt: 2 }}>
                        Person named {this.state["name"]}
                    </Typography>
                </Card>
            );
    }
}
export default FaceWidget