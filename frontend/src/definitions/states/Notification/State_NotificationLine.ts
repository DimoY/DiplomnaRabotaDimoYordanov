import {SvgIconTypeMap} from "@mui/joy";
//TODO Fix
interface State_NotificationLine {
    message:string,
    color:string,
    type:string,
    icon: SvgIconTypeMap<{}, "svg"> & {muiName: string}
}

export default State_NotificationLine;