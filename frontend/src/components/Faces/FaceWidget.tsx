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
            "url": props.faceUrl,
            "num":props.num
        };
    }
    render() {
        return (
                <Card variant="outlined" sx={{ "margin-bottom": 4, width: 320 }}>
                    <CardOverflow>
                        <AspectRatio ratio="1">
                            <img
                                src={this.state["url"]}
                                loading="lazy"
                                alt="face pictyre"
                            />
                        </AspectRatio>
                    </CardOverflow>
                    <Typography level="h2" sx={{ fontSize: 'md', mt: 2 }}>
                        Person named {this.state["name"]}. You have {this.state["num"]} images
                    </Typography>
                </Card>
            );
    }
}
export default FaceWidget