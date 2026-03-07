import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import HomeSocial from '../components/HomeSocial'
import Login from '../components/Login'
import Register from '../components/Register'
import { useAuth } from '../store/user'

export default function Home() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [isLoginView, setIsLoginView] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/chats')
    }
  }, [])
  return (
    <section className='home_auth'>
      <Helmet>
        <title>Transponder Snail</title>
        <meta
          name='description'
          content="Welcome to Transponder Snail, Let's have a chat."
        />
        <meta
          name='keywords'
          content='transponder snail, irfanshadikrishad, onepiece'
        />
      </Helmet>
      {isLoginView ? (
        <Login loginview={setIsLoginView} />
      ) : (
        <Register loginview={setIsLoginView} />
      )}
      <HomeSocial />
    </section>
  )
}
