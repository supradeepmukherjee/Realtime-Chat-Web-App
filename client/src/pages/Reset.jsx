import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Button, Container, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { server } from "../constants/config"
import { passwordValidator } from "../utils/validators"

const Reset = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector(({ auth }) => auth)
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [password, setPassword] = useState('')
    const [cPassword, setCpassword] = useState('')
    const [loading, setLoading] = useState(false)
    const resetPasswordHandler = async e => {
        e.preventDefault()
        const id = toast.loading('Setting New Password...')
        if (password !== cPassword) return toast.error('Passwords don\'t match', { id })
        let validationMsg = ''
        validationMsg = passwordValidator(password) || ''
        if (validationMsg !== '') return toast.error(validationMsg, { id })
        setLoading(true)
        try {
            const { data } = await axios.put(`${server}/user/reset-password/${token}`,
                { password },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            toast.success(data.msg, { id })
            navigate('/login')
            // check redirect and not same
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.msg || 'Something went wrong', { id })
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (user) return navigate('/')
        return () => {
            setPassword('')
            setCpassword('')
            setShow(false)
            setShow2(false)
            setLoading(false)
        }
    }, [navigate, user])
    return (
        <Container maxWidth='xs' className='h-screen !flex justify-center items-center' component='main'>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    paddingTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                <Typography variant='h5'>
                    Reset Password
                </Typography>
                <form onSubmit={resetPasswordHandler} className='w-full mt-4'>
                    <TextField
                        required
                        fullWidth
                        label='Enter New Password'
                        margin='normal'
                        type={show ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position='end'>
                                    <IconButton onClick={() => setShow(s => !s)}>
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        label='Confirm new Password'
                        margin='normal'
                        type={show2 ? 'text' : 'password'}
                        value={cPassword}
                        onChange={e => setCpassword(e.target.value)}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position='end'>
                                    <IconButton onClick={() => setShow2(s => !s)}>
                                        {show2 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <div className="flex justify-center">
                        <Button variant='contained' type='submit' className='!mt-4' disabled={loading}>
                            Reset Password
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <Link to='/login'>
                            <Button variant='outlined' disabled={loading}>
                                Go to Login Page
                            </Button>
                        </Link>
                    </div>
                </form>
            </Paper>
        </Container>
    )
}

export default Reset