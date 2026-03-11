import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chats from './pages/Chats'
import Error from './pages/Error'
import Home from './pages/Home'
import Stats from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
        <Route path='/stats' element={<Stats />} />
        <Route path='/*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
