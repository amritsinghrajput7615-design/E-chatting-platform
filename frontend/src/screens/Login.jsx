
import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/User.context.jsx'
import axios from '../config/Axios.jsx'
export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error,setError]= useState('')
  const { setUser } = useContext(UserContext)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
try {
   axios.post('/user/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
} catch (error) {
  console.log(error)
}
       
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-800/60 backdrop-blur rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h1>
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
           
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium disabled:opacity-60"
          >
             'Sign In'
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  )
}
