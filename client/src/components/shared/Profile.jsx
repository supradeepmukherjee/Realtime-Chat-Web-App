import { Avatar as Chavi, Stack, Typography } from "@mui/material"
import { Face, AlternateEmail as Username, CalendarMonth as Date, Info } from "@mui/icons-material"
import moment from 'moment'
import { memo } from "react"
import { useSelector } from "react-redux"
import { transformImg } from "../../lib/features"

const Profile = () => {
    const { user } = useSelector(state => state.auth)
    return (
        <Stack spacing='2rem' alignItems='center'>
            <Chavi className='!w-48 !h-48 object-contain mb-4 border-white border-4' src={transformImg(user?.chavi?.url)} />
            <ProfileDetail text={user?.name} label={'Name'} Icon={<Face />} />
            <ProfileDetail text={user?.uName} label={'Username'} Icon={<Username />} />
            <ProfileDetail text={user?.about} label={'About'} Icon={<Info />} />
            <ProfileDetail text={moment(user?.createdAt).fromNow()} label={'Joined'} Icon={<Date />} />
        </Stack >
    )
}

const ProfileDetail = memo(({ text, Icon, label }) => {
    return (
        <Stack direction='row' className='items-center text-white text-center' spacing='1rem'>
            {Icon}
            <Stack>
                <Typography variant="body1">
                    {text}
                </Typography>
                <Typography variant="caption" color='gray'>
                    {label}
                </Typography>
            </Stack>
        </Stack>
    )
})

export default Profile