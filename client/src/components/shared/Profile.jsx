import { Avatar as Chavi, Stack, Typography } from "@mui/material"
import { Face, AlternateEmail as Username, CalendarMonth as Date } from "@mui/icons-material"
import moment from 'moment'
import { memo } from "react"

const Profile = () => {
    return (
        <Stack spacing='2rem' alignItems='center'>
            <Chavi className='!w-48 !h-48 object-contain mb-4 border-white border-4' />
            <ProfileCard text={'Supradeep Mukherjee'} label={'Name'} Chavi={<Face />} />
            <ProfileCard text={'supradeep2004'} label={'Username'} Chavi={< Username />} />
            < ProfileCard text={'I don\'t follow the trends'} label={'Bio'}
            // Chavi = {</>}
            />
            <ProfileCard text={moment('2024-03-18T18:30:00.000Z').fromNow()} label={'Joined'} Chavi={<Date />} />
        </Stack >
    )
}

const ProfileCard = memo(({ text, Chavi, label }) => {
    return (
        <Stack direction='row' className='items-center text-white text-center' spacing='1rem'>
            {Chavi}
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