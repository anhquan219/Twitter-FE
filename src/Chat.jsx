import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";

const profile = JSON.parse(localStorage.getItem('profile')) || {}

export default function Chat() {
  const usenames = [
    {
      name: 'User 1',
      value: 'user64fe6e1928148bb040a26bc5'
    },
    {
      name: 'User 2',
      value: 'user64e8a7eea32158428219caaf' // Quankull73
    },
  ]
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [receiver, setReceiver] = useState('')

  useEffect(() => {
    // Trước khi connect gán auth với id để Server biết ai đang connected
    socket.auth = {
      _id: profile?._id
    }

    socket.connect()
    socket.on('receiver_private_message', (data) => {
      const content = data.content
      setMessages((messages) => [...messages, {
        content,
        isSender: false
      }])
    })

    return () => {
      socket.disconnect()
    }
  }, []);

  const send = (e) => {
    console.log(receiver);
    e.preventDefault()
    socket.emit('private_message', {
      content: value,
      to: receiver
    })
    setValue('')
    setMessages((messages) => [...messages, {
      content: value,
      isSender: true
    }])
  }

  const getProfile = (username) => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/users/${username}`, 
    ).then((res) => {
      setReceiver(res.data.result._id)
    })
  }

  return <div>
    <h1>Chat</h1>
    <div>
      {
        usenames.map((username) => (
            <button key={username.value} onClick={() => getProfile(username.value)}>{username.name}</button>
        ))
      }
    </div>
    <div className="chat">
      {
        messages.map((message, index) => (
          <div key={index}>
            <div className="message-container">
              <div className={'message ' + (message.isSender ? 'message-right' : '')}>{message.content}</div>
            </div>
          </div>
        ))
      }
    </div>
    <form onSubmit={send}>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
      <button type="submit">Send</button>
    </form>
  </div>;
}
