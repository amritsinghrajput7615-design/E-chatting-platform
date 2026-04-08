
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/Axios.jsx'
import { UserContext } from '../context/User.context.jsx'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(UserContext)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post('/user/register', { email, password })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='text-center mt-20 text-gray-400'>creating account..</div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-800/60 backdrop-blur rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-600/80 text-white p-2 rounded">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
