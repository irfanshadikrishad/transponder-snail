import { useEffect, useState } from 'react'
import { useAuth } from '../store/user.jsx'

export default function Stats() {
  const { API } = useAuth()
  const [count, setCount] = useState(0)

  const getUserCount = async () => {
    try {
      const response = await fetch(`${API}/api/users/count`)
      const data = await response.json()
      setCount(data.count)
    } catch (error) {
      console.log('Error fetching user count:', error)
    }
  }

  useEffect(() => {
    getUserCount()
  }, [])

  return (
    <main className='stats-container'>
      <div className='stats-card'>
        <div className='icon-wrapper'>
          {/* Simple SVG User Icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
            <path d='M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        </div>
        <h1 className='stats-title'>Total Users</h1>
        <h2 className='stats-count'>{count.toLocaleString()}</h2>
      </div>
    </main>
  )
}
