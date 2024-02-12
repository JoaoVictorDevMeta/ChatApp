import React, { useContext, useEffect } from 'react'
import Message from './Message'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/chatContext';

function Messages() {
  const [messages, setMessages] = React.useState([]) as any[]
  const { data } = useContext(ChatContext)!;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unsub()
    }
  }, [data.chatId])
  
  return (
    <div className='messages'>
        {messages && messages.map((content:any, index:number)=>(
          <Message message={content} key={index}/>
        ))}
        {messages.length == 0 && <span>Começe a conversar</span>}
    </div>
  )
}

export default Messages