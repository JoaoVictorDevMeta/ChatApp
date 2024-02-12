import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import Navbar from '../components/Navbar'

function Home() {

  return (
    <div className='home'>
        <div className='container'>
            <Navbar/>
            <div className='firstLayer'>
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    </div>
  )
}

export default Home