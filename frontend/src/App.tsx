import React, { useState } from 'react'
import './App.css'
import TopMenuBar from "./components/TopMenuBar/TopMenuBar";
function App() {
  const [count, setCount] = useState(0);
  const [ip,setIP] = useState("");

  return (
    <div className="App">
      <TopMenuBar/>
    </div>
  )
}

export default App
