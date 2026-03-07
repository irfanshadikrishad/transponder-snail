import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatInfoModal from '../components/ChatInfoModal.jsx'
import ChatLeft from '../components/ChatLeft.jsx'
import Navbar from '../components/Navbar.jsx'
import NotSelectedChat from '../components/NotSelectedChat.jsx'
import SelectedChat from '../components/SelectedChat.jsx'
import { useAuth } from '../store/user.jsx'
// TOASTIFY
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Chats() {
  const navigate = useNavigate()
  const { isLoggedIn, chats, selectedChat } = useAuth()
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 960)
    }

    window.addEventListener('resize', checkScreenSize)

    checkScreenSize()

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [chats])
  return (
    <section>
      <Navbar />
      <section className='chats'>
        {isMobile && !selectedChat._id ? (
          <ChatLeft />
        ) : (
          !isMobile && <ChatLeft />
        )}
        {isMobile && selectedChat._id ? (
          <section className='chat'>
            {selectedChat._id ? (
              <SelectedChat setIsChatInfoOpen={setIsChatInfoOpen} />
            ) : (
              <NotSelectedChat />
            )}
            {isChatInfoOpen && <ChatInfoModal chatClose={setIsChatInfoOpen} />}
          </section>
        ) : (
          !isMobile && (
            <section className='chat'>
              {selectedChat._id ? (
                <SelectedChat setIsChatInfoOpen={setIsChatInfoOpen} />
              ) : (
                <NotSelectedChat />
              )}
              {isChatInfoOpen && (
                <ChatInfoModal chatClose={setIsChatInfoOpen} />
              )}
            </section>
          )
        )}
      </section>
      <ToastContainer />
    </section>
  )
}
