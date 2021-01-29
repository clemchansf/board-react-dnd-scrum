import React, { useState, useRef } from 'react'
import './draggable.css'

export default function Draggable(props) {
  const [list, setList] = useState(props.data)

  return (
    <div className="board">
      {list.map((g, gIdx) => (
        <div className="container" key={gIdx}>
          <div className="title">{g.status.toUpperCase()}</div>
          {g.items.map((item, itemIdx) => (
            <div className="card" key={itemIdx}>
              <button className="indicator"></button>
              <p>{item}</p>
              <div className="card-icon"><button ></button></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}