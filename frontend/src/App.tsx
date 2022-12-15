import React, {useState} from 'react'
import './App.css'
import TopMenuBar from "./components/TopMenuBar/TopMenuBar";
import LoginForm from "./components/UserLogin_Register/LoginForm/LoginForm";
import CameraWindow from "./components/CameraFeed/CameraWindow";
import Importance from "./definitions/Enums/Importance/Importance";
import NotificationGroup from "./components/Notification/NotificationGroup/NotificationGroup";

function App() {
  const [count, setCount] = useState(0);
  const [ip,setIP] = useState("");
  let mapper  = new Map([
    ["10-16-2012",[{message:"obame",importanceLevel:Importance.Informative}]]
  ]);

  let loginWidget = (<LoginForm/>)
  let cameraWidget = (<CameraWindow/>)
  let notificationWidget = (<NotificationGroup data = {mapper}/>)
  return (
    <div className="App">
      <TopMenuBar loginWidget = {loginWidget} cameraWidget = {cameraWidget} notificationWidget = {notificationWidget}/>
    </div>
  )
}

export default App
