import React, {useState} from 'react'
import './App.css'
import TopMenuBar from "./components/TopMenuBar/TopMenuBar";
import LoginForm from "./components/UserLogin_Register/LoginForm/LoginForm";
import CameraWindow from "./components/CameraFeed/CameraWindow";
import Importance from "./definitions/Enums/Importance/Importance";
import NotificationGroup from "./components/Notification/NotificationGroup/NotificationGroup";
import RegisterForm from './components/UserLogin_Register/RegisterForm/RegisterForm';
import CameraList from './components/Camera/CameraList';
import FaceWindow from './components/Faces/FaceList';

function App() {
  const [count, setCount] = useState(0);
  const [ip,setIP] = useState("");
  let mapper  = new Map([
    ["10-16-2012",[{message:"obame",importanceLevel:Importance.Informative}]]
  ]);

  let registerWidget = (<div><RegisterForm/><br/><br/><LoginForm/></div>)
  let liveWidget = (<CameraWindow/>)
  let notificationWidget = (<NotificationGroup data = {mapper}/>)
  let cameraWidget=  (<CameraList/>)
  let faceWidget = (<FaceWindow/>)
  return (
    <div className="App">
      <TopMenuBar loginWidget = {registerWidget} liveWidget = {liveWidget} notificationWidget = {notificationWidget} cameraWidget = {cameraWidget} faceWidget = {faceWidget}/>
    </div>
  )
}

export default App
