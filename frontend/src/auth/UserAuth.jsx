import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/login')
                return
            }

            try {
                // fetch user from backend using token
                const res = await axios.get('/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setUser(res.data)
                setLoading(false)
            } catch (err) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}

export default UserAuth