import { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/authContext'

import myImage from '../assets/eu.png'

function Navbar() {
  const { currentUser } = useContext(AuthContext)!;

  return (
    <div className='navbar'>
        <h1>FumeVersa</h1>
        <div>
          <button onClick={()=>signOut(auth)}>
              Sair
          </button>
          <span>{currentUser?.displayName || "no name"}</span>
          <img src={currentUser?.photoURL || myImage} alt="UserImage" />
        </div>
    </div>
  )
}

export default Navbar