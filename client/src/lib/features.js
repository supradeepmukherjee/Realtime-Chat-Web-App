export const fileFormat = url => {
    const array = url.split('.')
    const extension = array[array.length - 1]
    if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') return 'video'
    else if (extension === 'mp3' || extension === 'wav') return 'audio'
    else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') return 'img'
    else return 'file'
}

export const transformImg = (url, width = 100) => {
    return url
}