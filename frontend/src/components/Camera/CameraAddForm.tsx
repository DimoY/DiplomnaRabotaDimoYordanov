
import { Radio, RadioGroup, TextField ,Box,Typography, Checkbox} from "@mui/joy";
import React from "react";

//<CameraWidget cameraName = {"Mr camington"} ip = {[255,255,255,255]} dateLastStreamd = {new Date()}/>

class CameraAddForm extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {
            setInfo: props.setInfo,
            justify:"outside",
            faceRecognition:false,
            maskRecognition:false
        }
    }
    handleRadio(event:any){
        this.setState({"justify":event.target.value})
        this.state.setInfo({"type":"cameraType","value":event.target.value})
    }
    handleCheckbox(type){
        this.setState({"faceRecognition":!this.state[type]})
        this.state.setInfo({"type":type,"value":this.state[type]})
    }
    render() {
        return (
            <div>
                <TextField
                    color="primary"
                    label="Camera name"
                    placeholder="Name of the camera"
                    required
                    onChange={(e) => { this.state.setInfo({ "type": "name", "value": e.target.value }) }}
                />
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    onChange={(e) => { this.state.setInfo({ "type": "ip0", "value": e.target.value }) }}
                />
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    onChange={(e) => { this.state.setInfo({ "type": "ip1", "value": e.target.value }) }}
                />
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    onChange={(e) => { this.state.setInfo({ "type": "ip2", "value": e.target.value }) }}
                />
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    onChange={(e) => { this.state.setInfo({ "type": "ip3", "value": e.target.value }) }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography id="segmented-controls-example" fontWeight="lg" fontSize="sm">
                        Camera location:
                    </Typography>
                    <RadioGroup
                        row
                        aria-labelledby="segmented-controls-example"
                        name="justify"
                        value={this.state["justify"]}
                        onChange={this.handleRadio.bind(this)}
                        sx={{
                            minHeight: 48,
                            padding: '4px',
                            borderRadius: 'md',
                            bgcolor: 'neutral.softBg',
                            '--RadioGroup-gap': '4px',
                            '--Radio-action-radius': '8px',
                        }}
                    >
                        {['outside', 'in car'].map((item) => (
                            <Radio
                                key={item}
                                color="neutral"
                                value={item}
                                disableIcon
                                label={item}
                                variant="plain"
                                sx={{
                                    px: 2,
                                    alignItems: 'center',
                                }}
                                slotProps={{
                                    action: ({ checked }) => ({
                                        sx: {
                                            ...(checked && {
                                                bgcolor: 'background.surface',
                                                boxShadow: 'md',
                                                '&:hover': {
                                                    bgcolor: 'background.surface',
                                                },
                                            }),
                                        },
                                    }),
                                }}
                            />
                        ))}
                    </RadioGroup>
                </Box>
                <Checkbox
                    color="primary"
                    label="Face recognition"
                    variant="soft"
                    onChange={(e) => {handleCheckbox("faceRecognition") }}
                />
                <Checkbox
                    color="primary"
                    label="Mask Recognition"
                    variant="soft"
                    onChange={(e) => { handleCheckbox("maskRecognition")}}
                />
            </div>
        );
    }
}
export default CameraAddForm