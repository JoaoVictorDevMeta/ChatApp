import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext';
import { BsPaperclip } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { Timestamp, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function Input() {
  const [ text, setText] = useState<string>("")
  const [ img, setImg ] = useState<File | null>(null)
  const [fileName, setFileName] = useState('');

  const {currentUser} = useContext(AuthContext)!;
  const { data } = useContext(ChatContext)!;

  const handleSend = async ()=>{
    if (text.replace(/ /g,'').length <= 0){
      setText('')
      setImg(null)
      return
    }

    if(img){
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        'state_changed',
        () => {},
        () => {},
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL:string) => {
            await updateDoc( doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              })
            })
        });
      });

    } else {
      console.log(data.chatId)
      await updateDoc( doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId+".lastMessage"]: {
        text,
      },
      [data.chatId+".date"]: Timestamp.now(),
    })
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId+".lastMessage"]: {
        text,
      },
      [data.chatId+".date"]: Timestamp.now(),
    })

    setText('')
    setImg(null)
  }

  const handleKey = (e:any) => {
    e.key == "Enter" && handleSend()
  }
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <div className='input-message'>
        <input type="text" placeholder='Sua Mensagem...' onChange={e=>setText(e.target.value)} value={text}/>
        <div className='send'>
            <BsPaperclip />
            <input 
                type="file" 
                onChange={e=>{
                  setImg(e.target.files![0]);
                  setFileName(e.target.files![0].name);
                }}
                hidden
                onKeyDown={handleKey}
                accept='image/*'
                id='file'
            />
            <p>{fileName} {fileName && <button><IoIosClose /></button>}</p>
            <label htmlFor="file"><CiImageOn /></label>
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}

export default Input