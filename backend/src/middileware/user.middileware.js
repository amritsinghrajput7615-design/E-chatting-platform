const jwt = require('jsonwebtoken')

const userMiddileware = (req, res, next) => {
    let token = null

    const authHeader = req.headers['authorization'] || req.header && req.header('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    } else if (req.headers.cookie) {
        const cookieHeader = req.headers.cookie
        const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('token='))
        if (match) token = match.split('=')[1]
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        req.user = decoded
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = userMiddileware