import { deleteCookie } from 'cookies-next'

export default async (req, res) => {
    deleteCookie('token', { req, res, path: '/api/callback', domain: 'spot.rence.la' })
    res.redirect('/')
}
