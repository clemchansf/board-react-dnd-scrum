import React, { useState } from 'react'
import './App.css'
import data from './data.js'
import Draggable from './components/draggable.js'
function App() {
  return (
    <Draggable data={data} />
  );
}

export default App;
