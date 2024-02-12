import React, { useContext, useEffect } from 'react'
import { IoIosVideocam, IoIosMore } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/chatContext';

function Chat() {
  const { data } = useContext(ChatContext)!;
  console.log(data.chatId)
  return (
    <div className='chat'>
      {data.chatId != 'null' ?
      <>
        <div className='chatInfo'>
            <span>{data.user?.displayName}</span>
            <div className="chatIcons">
                <IoIosVideocam />
                <IoPersonAdd />
                <IoIosMore />
            </div>
        </div>
        <Messages />
        <Input />
      </>
      :
      <h4>Selecione uma conversa</h4>  
    }
    </div>
  )
}

export default Chat