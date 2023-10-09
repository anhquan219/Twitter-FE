import { useEffect, useState } from "react";
import socket from "./socket";

const profile = JSON.parse(localStorage.getItem('profile')) || {}

export default function Chat() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  useEffect(() => {

    // Trước khi connect gán auth với id để Server biết ai đang connected
    socket.auth = {
      _id: profile?._id
    }

    socket.connect()
    socket.on('receiver_private_message', (data) => {
      const content = data.content
      setMessages((messages) => [...messages, content])
    })

    return () => {
      socket.disconnect()
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('private_message', {
      content: value,
      to: '64fe6e1928148bb040a26bc5'
    })
    setValue('')
  }

  return <div>
    <h1>Chat</h1>
    <div>
      {
        messages.map((message, index) => (
          <div key={index}>
            <span>{message}</span>
          </div>
        ))
      }
    </div>
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
      <button type="submit">Send</button>
    </form>
  </div>;
}
