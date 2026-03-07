import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chats from './pages/Chats'
import Error from './pages/Error'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
        <Route path='/*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
