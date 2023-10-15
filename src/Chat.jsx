import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';

const profile = JSON.parse(localStorage.getItem('profile')) || {}
const LIMIT = 10
const PAGE = 1
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
  const [pagination, setPagination] = useState({
    page: PAGE,
    total_page: 0
  })

  useEffect(() => {
    // Trước khi connect gửi Authorization lên để Server biết ai đang connected
    socket.auth = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }

    socket.connect()
    socket.on('receiver_message', (data) => {
      const {payload} = data
      setConversations((conversations) => [payload, ...conversations])
    })

    // Bắt lỗi trước khi connnect thành công
    socket.on('connect_error', (err) => {
      console.log(err)
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

    setConversations((conversations) => [
      {
      ...conversation,
      _id: new Date().getTime()
      },
      ...conversations
    ])
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
      .get(`${import.meta.env.VITE_API_URI}/conversations/receivers/${receiver}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        params: {
          limit: LIMIT,
          page: PAGE
        }
      }
    ).then((res) => {
      const {conversations, page, total_page} = res.data.result
      setConversations(conversations)
      setPagination({
        page,
        total_page
      })
    })
  }

  const fetchMoreDataConversations = () => {
    if (receiver && pagination.page < pagination.total_page) {
      axios
      .get(`${import.meta.env.VITE_API_URI}/conversations/receivers/${receiver}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        params: {
          limit: LIMIT,
          page: pagination.page + 1
        }
      }).then((res) => {
        const {conversations, page, total_page} = res.data.result
        setConversations((prev) => [...prev, ...conversations])
        setPagination({
          page,
          total_page
        })
      })
    }
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
    <div
      id="scrollableDiv"
      style={{
        height: 300,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      <InfiniteScroll
        dataLength={conversations.length}
        next={fetchMoreDataConversations}
        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={pagination.page < pagination.total_page}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {
          conversations.map((conversation) => (
            <div key={conversation._id}>
              <div className="message-container">
                <div className={'message ' + (conversation.sender_id === profile._id ? 'message-right' : '')}>{conversation.content}</div>
              </div>
            </div>
          ))
        }
      </InfiniteScroll>
    </div>
    <form onSubmit={send}>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
      <button type="submit">Send</button>
    </form>
  </div>;
}
