import React from "react";
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';


class CameraWindow extends React.Component {
    constructor(props: Prop_CameraWidget) {
        super(props);
        this.state = {
            "name": props.cameraName,
            "ip": props.ip,
            "date": props.dateLastStreamd,
            "id":props.id
        };
    }
    render() {
        return (
                <Card variant="outlined" sx={{ width: 320 }}>
                    {/* <CardOverflow>
                        <AspectRatio ratio="2">
                            <img
                                src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
                                srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>
                    </CardOverflow> */}
                    <Typography level="h2" sx={{ fontSize: 'md', mt: 2 }}>
                        {this.state["name"]}
                    </Typography>
                    <Typography level="body2" sx={{ mt: 0.5, mb: 2 }}>
                        {this.state["ip"].join(":")}
                    </Typography>
                    <Typography level="body2" sx={{ mt: 0.5, mb: 2 }}>
                        {this.state["id"]}
                    </Typography>
                    <Divider />
                    <CardOverflow
                        variant="soft"
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            py: 1.5,
                            px: 'var(--Card-padding)',
                            bgcolor: 'background.level1',
                        }}
                    >
                        <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                            {this.state["date"].toUTCString()}
                        </Typography>
                    </CardOverflow>
                </Card>
            );
    }
}
export default CameraWindow