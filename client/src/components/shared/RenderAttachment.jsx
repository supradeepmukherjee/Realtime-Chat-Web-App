import { transformImg } from "../../lib/features"
import File from '@mui/icons-material/FileOpen'

const RenderAttachment = (file, url) => {
    if (file === 'video') return <video src={url} preload='none' width='200px' controls />
    else if (file === 'img') return <img src={transformImg(url, 200)} alt='Attachment' className='w-48 h-36 object-contain' />
    else if (file === 'audio') return <audio src={url} preload='none' controls />
    else return <File />
}

export default RenderAttachment