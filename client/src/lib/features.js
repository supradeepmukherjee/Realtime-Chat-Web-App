import moment from "moment"

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

export const getLast7Days = () => {
    const currentDate = moment()
    let last7Days = []
    for (let i = 0; i < 7; i++) {
        const date = currentDate.clone().subtract(i, 'days')
        const day = date.format('dddd')
        last7Days.unshift(day)
    }
    return last7Days
}