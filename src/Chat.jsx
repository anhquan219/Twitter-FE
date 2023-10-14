import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";

const profile = JSON.parse(localStorage.getItem('profile')) || {}
const usenames = [
  {
    name: 'Quan 22',
    value: 'user64fe6e1928148bb040a26bc5'
  },
  {
    name: 'Quan 21',
    value: 'user64e0864e00410593d4e4c158'
  },
]

export default function Chat() {
  const [value, setValue] = useState('')
  const [conversations, setConversations] = useState([])
  const [receiver, setReceiver] = useState('')

  useEffect(() => {
    // Trước khi connect gán auth với id để Server biết ai đang connected
    socket.auth = {
      _id: profile?._id
    }

    socket.connect()
    socket.on('receiver_message', (data) => {
      const {payload} = data
      setConversations((conversations) => [...conversations, payload])
    })

    return () => {
      socket.disconnect()
    }
  }, []);

  useEffect(() => {
    if (receiver) {
      getConversation(receiver)
    }
  }, [receiver]);

  const send = (e) => {
    setValue('')
    e.preventDefault()
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver
    }

    socket.emit('send_message', {
      payload: conversation
    })

    setConversations((conversations) => [...conversations, {
      ...conversation,
      _id: new Date().getTime()
    }])
  }

  const getProfile = (username) => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/users/${username}`, 
    ).then((res) => {
      setReceiver(res.data.result._id)
    })
  }

  const getConversation = (receiver) => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/conversations/receivers/${receiver}?limit=10&page=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    ).then((res) => {
      setConversations(res.data.result.conversations)
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
        conversations.map((conversation) => (
          <div key={conversation._id}>
            <div className="message-container">
              <div className={'message ' + (conversation.sender_id === profile._id ? 'message-right' : '')}>{conversation.content}</div>
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
