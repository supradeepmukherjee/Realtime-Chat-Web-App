import moment from "moment"

const fileFormat = url => {
    const array = url.split('.')
    const extension = array[array.length - 1]
    if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') return 'video'
    else if (extension === 'mp3' || extension === 'wav') return 'audio'
    else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') return 'img'
    else return 'file'
}

const transformImg = (url, width = 100) => url.replace('upload/', `upload/dpr_auto/w_${width}/`)

const getLast7Days = () => {
    const currentDate = moment()
    let last7Days = []
    for (let i = 0; i < 7; i++) {
        const date = currentDate.clone().subtract(i, 'days')
        const day = date.format('dddd')
        last7Days.unshift(day)
    }
    return last7Days
}

const getOrSave_Storage = (get, key, value) => {
    if (get) return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
    else localStorage.setItem(key, JSON.stringify(value))
}

export { getOrSave_Storage, fileFormat, getLast7Days, transformImg }