import { Audiotrack, Image, Videocam, InsertDriveFile } from "@mui/icons-material"
import { ListItemText, Menu, MenuItem, MenuList } from "@mui/material"
import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc"
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from "../../redux/api"

const FileMenu = ({ anchorEl, id }) => {
    const { isFileMenu } = useSelector(({ misc }) => misc)
    const dispatch = useDispatch()
    const imgRef = useRef(null)
    const audioRef = useRef(null)
    const videoRef = useRef(null)
    const fileRef = useRef(null)
    const [sendAttachments] = useSendAttachmentsMutation()
    const fileChangeHandler = async (e, key_) => {
        const files = Array.from(e.target.files)
        if (files.length < 1) return
        if (files.length > 5) return toast.error(`Max. 5 ${key_} can sent at once`)
        dispatch(setUploadingLoader(true))
        const toastID = toast.loading('Sending...')
        dispatch(setIsFileMenu(false))
        try {
            const myForm = new FormData()
            myForm.append('id', id)
            files.forEach(f => myForm.append('files', f))
            const { data, error } = await sendAttachments(myForm)
            if (data) toast.success(`${key_} sent successfully`, { id: toastID })
            else toast.error(error.data.msg, { id: toastID })
        } catch (err) {
            console.log(err)
            toast.error(`Something went wrong`, { id: toastID })
        } finally {
            dispatch(setUploadingLoader(false))
        }
    }
    const selectRef = ref_ => ref_.current.click()
    const items = [
        {
            Icon: <Image />,
            ref_: imgRef,
            text: 'Image',
            accept: 'image/png, image/jpeg, image/gif',
            key_: 'Images',
        },
        {
            Icon: <Videocam />,
            ref_: videoRef,
            text: 'Video',
            accept: 'video/mp4, video/webm, video/ogg',
            key_: 'Videos',
        },
        {
            Icon: <Audiotrack />,
            ref_: audioRef,
            text: 'Audio',
            accept: 'audio/mp3, audio/wav, audio/ogg',
            key_: 'Audios',
        },
        {
            Icon: <InsertDriveFile />,
            ref_: fileRef,
            text: 'File',
            accept: '*',
            key_: 'Files',
        },
    ]
    return (
        <Menu anchorEl={anchorEl} open={isFileMenu} onClose={() => dispatch(setIsFileMenu(false))}>
            <div className="w-40">
                <MenuList>
                    {items.map(({ ref_, Icon, text, accept, key_ }) => <Item ref_={ref_} Icon={Icon} text={text} accept={accept} key_={key_} key={key_} changeHandler={e => fileChangeHandler(e, key_)} selectRef={selectRef} />)}
                </MenuList>
            </div>
        </Menu>
    )
}

const Item = ({ changeHandler, text, Icon, accept, key_, ref_, selectRef }) => (
    <MenuItem onClick={() => selectRef(ref_)}>
        {Icon}
        <ListItemText className="ml-2">
            {text}
        </ListItemText>
        <input ref={ref_} type="file" multiple accept={accept} hidden onChange={e => changeHandler(e, key_)} />
    </MenuItem>
)

export default FileMenu