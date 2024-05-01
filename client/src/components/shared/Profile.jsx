/* eslint-disable react/prop-types */
import { Avatar as Chavi, Button, Stack, Typography } from "@mui/material"
import { Face, AlternateEmail as Username, CalendarMonth as Date, Info, People } from "@mui/icons-material"
import moment from 'moment'
import { memo, useEffect, useState } from "react"
import { transformImg } from "../../lib/features"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Profile = ({ data, id }) => {
    const { user } = useSelector(state => state.auth)
    const [chavi, setChavi] = useState(user.chavi.url)
    const [name, setName] = useState(user.name)
    const [uName, setUname] = useState(user.uName)
    const [about, setAbout] = useState(user.about)
    const [createdAt, setCreatedAt] = useState(user.createdAt)
    const [grpChat, setGrpChat] = useState(false)
    const [myDetails, setMyDetails] = useState(true)
    const [n, setN] = useState(0)
    useEffect(() => {
        console.log(user, 'profile user')
        if (data) {
            if (myDetails) {
                setName(user.name)
                setUname(user.uName)
                setAbout(user.about)
                setCreatedAt(user.createdAt)
                setChavi(user.chavi.url)
                setGrpChat(data.grpChat)
                setN(data.members.length)
            }
            else {
                setName(data.name)
                setUname(data.uName)
                setAbout(data.about)
                setCreatedAt(data.createdAt)
                setChavi(data.chavi)
                setGrpChat(data.grpChat)
                setN(data.members.length)
            }
        }
        else {
            if (myDetails) {
                setChavi(user.chavi.url)
                setName(user.name)
                setUname(user.uName)
                setAbout(user.about)
                setCreatedAt(user.createdAt)
            }
        }
    }, [data, myDetails, user])
    return (
        <Stack spacing='1.6rem' alignItems='center'>
            <Chavi className='!w-48 !h-48 object-contain mb-4 border-white border-4' src={transformImg(chavi)} />
            <ProfileDetail text={name} label={`${myDetails ? 'My ' : ''}Name`} Icon={!(myDetails && grpChat) ? <Username /> : <Face />} />
            {(myDetails) && <ProfileDetail text={uName} label={'Username'} Icon={<Username />} />}
            <ProfileDetail text={(!myDetails && grpChat) ? n : about} label={(!myDetails && grpChat) ? 'Members' : 'About'} Icon={(!myDetails && grpChat) ? <People /> : <Info />} />
            <ProfileDetail text={moment(createdAt).fromNow()} label={(!myDetails && grpChat) ? 'Created' : 'Joined'} Icon={<Date />} />
            {(!myDetails && grpChat) &&
                <Link to={`/groups?grp=${id}`}>
                    <Button variant='contained'>
                        Go to Group
                    </Button>
                </Link>}
            {id && <Button variant='contained' onClick={() => setMyDetails(!myDetails)}>
                see {myDetails ? (grpChat ? 'group' : 'friend') : 'personal'} details
            </Button>}
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