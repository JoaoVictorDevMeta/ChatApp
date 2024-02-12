import { onSnapshot, doc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext';

type ChatTipos = [
  string, 
  { 
    date: any;
    userInfo: 
    { photoURL: string; 
      displayName: string; 
    }; 
    lastMessage?: { text: string; }; 
  }
];

function Chats() {
  const [chats, setChats ] = useState([])
  const { currentUser } = useContext(AuthContext)!;
  const { dispatch } = useContext(ChatContext)!;

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data() as never[]);
      })
  
      return () => {
        unsub();
      }
    }
    
    currentUser.uid && getChats()
  }, [currentUser.uid]);

  const handleSelect = (u:any) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  }
  
  return (
    <div>
      {(Object.entries(chats)?.sort((a: ChatTipos, b:ChatTipos)=>b[1].date - a[1].date) as ChatTipos[]).map(chat => (
        <div 
        className="userChat" 
        key={chat[0]} 
        onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="rodrigoGoes" />
          <div>
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats