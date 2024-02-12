import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore" 
import { db } from '../firebase' 
import { AuthContext } from '../context/authContext'

function Search() {
  const [username, setUsername] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  const [err, setErr] = useState<boolean>(false)
  const {currentUser} = useContext(AuthContext)!;

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), 
    where('nome', '==', username))

    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
    }catch(err){
      console.log(err)
      setErr(true)
    }
  }

  const handleKey = (e:any) => {
    e.key == "Enter" && handleSearch()
  }

  const handleSelect = async () => {
    const combinedId = 
      currentUser.uid > user.uid 
      ? currentUser.uid + user.uid 
      : user.uid + currentUser.uid;

    try{
      const res = await getDoc(doc(db, "chats", combinedId));

      if(!res.exists()){
        await setDoc(doc(db, "chats", combinedId), {messages:[]})
        
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId+".userInfo"]: {
            uid: user.uid,
            displayName: user.nome,
            photoURL: user.photoURL,
          },
          [combinedId+".date"]: serverTimestamp(),
        })

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId+".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId+".date"]: serverTimestamp(),
        })
      }
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className='searchBar'>
        <div className='searchForm'>
            <input 
            type="text" 
            placeholder='user...'
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKey}
            value={username}
            />
        </div>
        {err && <span>Usuario nao encontrado</span>}
        {user && 
          <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="rodrigoGoes" />
            <div>
                <span>{user.nome}</span>
            </div>
          </div>
        }
    </div>
  )
}

export default Search