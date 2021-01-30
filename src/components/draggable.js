import React, { useState, useRef } from 'react'
import './Draggable.css'

export default function Draggable(props) {
  const [list, setList] = useState(props.data)
  const [dragging, setDragging] = useState(false)
  const draggedItemPosition = useRef()
  const draggedItemEventTarget = useRef()

  function handleDragStart(e, pos) {
    draggedItemEventTarget.current = e.target
    draggedItemEventTarget.current.addEventListener('dragend', handleDragEnd)
    draggedItemPosition.current = pos
    console.log(`drag start: ${JSON.stringify(pos)}`)
    // setDragging(true)

    // put it into event queue to wait after exiting drag start  
    setTimeout(() => {
      setDragging(true);
    }, 0)
  }
  function handleDragEnter(e, pos) {
    // e.preventDefault()

    if (pos.gIdx === draggedItemPosition.current.gIdx &&
      pos.itemIdx === draggedItemPosition.current.itemIdx)
      return

    let oldItem = draggedItemPosition.current
    let { gIdx, itemIdx } = pos
    console.log(`drag enter pos: ${JSON.stringify(pos)}, from ${JSON.stringify(oldItem)}`)

    setList(prevList => {
      console.log(`drag enter prevList : ${JSON.stringify(prevList, null, 2)}`)
      let newList = JSON.parse(JSON.stringify(prevList))
      let removedItem = newList[oldItem.gIdx].items.splice(oldItem.itemIdx, 1)
      console.log(`drag enter removedItem : ${JSON.stringify(removedItem)}`)
      console.log(`drag enter shrinked old items : ${JSON.stringify(newList[oldItem.gIdx])}`)
      newList[gIdx].items.splice(itemIdx, 0, removedItem[0])
      console.log(`drag enter expanded new items : ${JSON.stringify(newList[gIdx])}`)
      console.log(`drag enter setList --- : ${JSON.stringify(newList, null, 2)}`)
      return newList
    })

    draggedItemPosition.current = pos
    console.log(`drag enter from pos: ${JSON.stringify(pos)}`)

  }
  function handleDragEnd(e) {
    e.preventDefault()
    if (draggedItemEventTarget.current && draggedItemEventTarget.current.removeEventListener) {
      draggedItemEventTarget.current.removeEventListener('dragend', handleDragEnd)
    }
    console.log(`drag end list: ${JSON.stringify(list, null, 2)}`)
    console.log(`drag end: ${JSON.stringify(draggedItemPosition.current)}`)

    draggedItemEventTarget.current = null
    draggedItemPosition.current = null
    setDragging(false)
  }

  function getDraggingStyle(pos, hide, show = {}) {
    return (dragging
      && draggedItemPosition
      && draggedItemPosition.current
      && pos
      && draggedItemPosition.current.gIdx === pos.gIdx
      && draggedItemPosition.current.itemIdx === pos.itemIdx)
      ? hide : show
  }

  function getStatusColor({ status }) {
    const stat = status.toLowerCase();
    const backgroundColor = (stat === "open") ? "red"
      : (stat === "in progress") ? "purple"
        : (stat === "in review") ? "yellow"
          : (stat === "done") ? "green" : "black"
    return { backgroundColor }
  }

  const styles = {
    hideContents: { color: "silver", backgroundColor: "silver" },
    hideControl: { visibility: "hidden" },
  }

  return (
    <div className="board">
      {list.map((g, gIdx) => (
        <div className="container" key={gIdx} onDragEnter={(list[gIdx].items.length === 0) ? e =>
          // console.log(``)
          handleDragEnter(e, { gIdx, itemIdx: 0 })
          : null}>
          <div className="title">{g.status.toUpperCase()}</div>
          {g.items.map((item, itemIdx) => {
            const pos = { gIdx, itemIdx }
            return (
              <div
                onDragStart={e => handleDragStart(e, pos)}
                onDragEnter={e => handleDragEnter(e, pos)}
                // open issue: onDragEnd={e => handleDragEnd(e, pos)}
                draggable className="card" key={itemIdx}
                style={getDraggingStyle(pos, styles.hideContents)}
              >
                <button className="indicator" style={getDraggingStyle(pos, styles.hideControl, getStatusColor(list[gIdx]))}></button>
                <p>{item}</p>
                <div className="card-icon"><button style={getDraggingStyle(pos, styles.hideControl)}></button></div>
              </div>
            )
          })}
        </div>
      ))
      }
    </div >
  )
}