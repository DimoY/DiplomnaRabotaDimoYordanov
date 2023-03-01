import {useState} from 'react'
import './App.css'
import TopMenuBar from "./components/TopMenuBar/TopMenuBar";
import NotificationGroup from "./components/Notification/NotificationGroup/NotificationGroup";
import CameraList from './components/Camera/CameraList';
import FaceWindow from './components/Faces/FaceList';
import UserAuthWidget from './components/UserLogin_Register/MainForm';

function App() {
  const [count, setCount] = useState(0);
  const [ip,setIP] = useState("");

  let registerWidget = (<UserAuthWidget/>)
  let notificationWidget = (<NotificationGroup/>)
  let cameraWidget=  (<CameraList/>)
  let faceWidget = (<FaceWindow/>)
  return (
    <div className="App">
      <TopMenuBar loginWidget = {registerWidget} notificationWidget = {notificationWidget} cameraWidget = {cameraWidget} faceWidget = {faceWidget}/>
    </div>
  )
}

export default App
