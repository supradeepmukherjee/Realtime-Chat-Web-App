import { CameraAlt as Camera, Visibility, VisibilityOff } from "@mui/icons-material"
import { Avatar as Chavi, Button, Dialog, DialogTitle, IconButton, InputAdornment, Stack, TextField } from "@mui/material"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import useMutation from "../../hooks/useMutation"
import { useLazyMyProfileQuery, useUpdatePasswordMutation, useUpdateProfileMutation } from "../../redux/api"
import { userExists } from "../../redux/reducers/auth"
import { setIsEditAccount } from "../../redux/reducers/misc"
import { nameValidator, passwordValidator, uNameValidator } from "../../utils/validators"
import { HiddenInput } from "../Styled"

const EditAccount = () => {
    const { isEditAccount } = useSelector(({ misc }) => misc)
    const { user } = useSelector(({ auth }) => auth)
    const dispatch = useDispatch()
    const [updateProfile] = useMutation(useUpdateProfileMutation)
    const [updatePassword] = useMutation(useUpdatePasswordMutation)
    const [updateUser] = useLazyMyProfileQuery()
    const [isPassword, setIsPassword] = useState(false)
    const [showArr, setShowArr] = useState([false, false, false])
    const [userDetails, setUserDetails] = useState({
        name: user.name,
        about: user.about,
        uName: user.uName,
        email: user.email
    })
    const [passwordDetails, setPasswordDetails] = useState({
        old: '',
        newP: '',
        confirmP: ''
    })
    const [chavi, setChavi] = useState(user.chavi.url)
    const [chaviFile, setChaviFile] = useState(null)
    const chaviHandler = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            setChavi(reader.result)
        }
        setChaviFile(file)
    }
    const userDetailsChangeHandler = e => setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    const passwordDetailsChangeHandler = e => setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value })
    const submitHandler = async e => {
        e.preventDefault()
        let validationMsg = ''
        if (!isPassword) {
            validationMsg = nameValidator(userDetails.name) || uNameValidator(userDetails.uName) || ''
            if (validationMsg !== '') return toast.error(validationMsg)
            const formData = new FormData()
            if (chavi !== user.chavi.url) formData.append('chavi', chaviFile)
            if (user.name !== userDetails.name) formData.append('name', userDetails.name)
            if (user.uName !== userDetails.uName) formData.append('uName', userDetails.uName)
            if (user.about !== userDetails.about) formData.append('about', userDetails.about)
            if (user.email !== userDetails.email) formData.append('email', userDetails.about)
            toast.dismiss()
            dispatch(setIsEditAccount(false))
            await updateProfile('Updating Profile', formData)
            updateUser()
                .then(({ data }) => dispatch(userExists(data.user)))
                .catch(err => console.log(err))
        } else {
            validationMsg = passwordValidator(passwordDetails.newP) || ''
            if (validationMsg !== '') return toast.error(validationMsg)
            if (passwordDetails.newP !== passwordDetails.confirmP) return toast.error('Passwords don\'t match')
            toast.dismiss()
            dispatch(setIsEditAccount(false))
            updatePassword('Updating Password', {
                old: passwordDetails.old,
                newP: passwordDetails.newP
            })
        }
    }
    const textFields = [
        {
            label: isPassword ? 'Enter Old Password' : 'Name',
            name: isPassword ? 'old' : 'name',
            value: isPassword ? passwordDetails.old : userDetails.name,
            show: showArr[0]
        },
        {
            label: isPassword ? 'Enter New Password' : 'Username',
            name: isPassword ? 'newP' : 'uName',
            value: isPassword ? passwordDetails.newP : userDetails.uName,
            show: showArr[1]
        },
        {
            label: isPassword ? 'Confirm New Password' : 'About',
            name: isPassword ? 'confirmP' : 'about',
            value: isPassword ? passwordDetails.confirmP : userDetails.about,
            show: showArr[2]
        },
    ]
    return (
        <Dialog open={isEditAccount} onClose={() => dispatch(setIsEditAccount(!isEditAccount))}>
            <Stack
                p={{
                    xs: '1rem',
                    sm: '2.7rem'
                }}
                className='!pt-1 !pb-1 !overflow-x-hidden'
                width='25rem'
                spacing='2rem'>
                <DialogTitle textAlign='center' variant='h5'>
                    Update {isPassword ? 'Password' : 'Profile'}
                </DialogTitle>
                {!isPassword &&
                    <Stack className='relative w-20 !m-auto'>
                        <Chavi className='!w-20 !h-20 object-cover' src={chavi} />
                        <IconButton className='!absolute left-14 top-14 w-6 h-6 !text-[#ffffff] !bg-[#00000080] hover:text-[#000000b3]' component='label'>
                            <>
                                <Camera className='!w-4' />
                                <HiddenInput type='file' accept='image/*' onChange={chaviHandler} />
                            </>
                        </IconButton>
                    </Stack>}
                <form onSubmit={submitHandler} className='w-full mt-4'>

                    {textFields.map(({ label, name, value, show }, i) => <TextField
                        required
                        fullWidth
                        label={label}
                        name={name}
                        margin='dense'
                        value={value}
                        type={isPassword && !show ? 'password' : 'text'}
                        onChange={isPassword ? passwordDetailsChangeHandler : userDetailsChangeHandler}
                        key={name}
                        InputProps={{
                            endAdornment:
                                isPassword ?
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowArr(showArr.map((s, index) => {
                                            if (index === i) return !s
                                            else return s
                                        }))}>
                                            {show ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    : <></>
                        }}
                    />)}

                    {!isPassword &&
                        <TextField
                            required
                            fullWidth
                            label='Email'
                            name='email'
                            margin='dense'
                            value={userDetails.email}
                            type='email'
                            onChange={userDetailsChangeHandler}
                        />}

                    <Stack direction='row' justifyContent='space-evenly' mt='1rem'>
                        <Button variant='outlined' color='error' onClick={() => dispatch(setIsEditAccount(!isEditAccount))}>
                            Cancel
                        </Button>
                        <Button variant='contained' type="submit">
                            Update
                        </Button>
                    </Stack>
                </form>
                <Button className='!mt-4 !mb-4' variant='contained' onClick={() => setIsPassword(!isPassword)}>
                    I want to update my {isPassword ? 'Profile' : 'Password'}
                </Button>
            </Stack>
        </Dialog>
    )
}

export default EditAccount