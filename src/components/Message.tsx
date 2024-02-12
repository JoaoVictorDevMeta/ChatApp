import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext';

function Message({message}:any) {
  
  const {currentUser} = useContext(AuthContext)!;
  const { data } = useContext(ChatContext)!;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId == currentUser.uid && "owner"}`}>
        <div className="messageInfo">
            <img src={message.senderId == currentUser.uid 
            ? currentUser.photoURL
            : data.user.photoURL
          } alt="aaa" />
            <span>Just Now</span>
        </div>
        <div className='messageContent'>
            <p>{message.text}</p>
            { message.img &&
            <img src={message.img} alt="aaa" />
            }
        </div>
    </div>
  )
}

export default Message