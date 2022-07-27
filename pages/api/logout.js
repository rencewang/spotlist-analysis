import { deleteCookie } from 'cookies-next'

export default async (req, res) => {
    deleteCookie('token', { req, res })
    res.redirect('/')
}
