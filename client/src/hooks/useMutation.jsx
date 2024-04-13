import { useState } from "react"
import toast from 'react-hot-toast'

const useMutation = useMutation => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [mutate] = useMutation()
    const executeMutation = async (toastMsg, ...args) => {
        setLoading(true)
        const toastId = toast.loading(toastMsg || 'Please wait...')
        try {
            const res = await mutate(...args)
            if (res.data) {
                toast.success(res?.data?.msg || 'Success', { id: toastId })
                setData(res.data)
            } else
                toast.error(res?.error?.data?.msg || 'Something went wrong', { id: toastId })
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong', { id: toastId })
        } finally {
            setLoading(false)
        }
    }
    return [executeMutation, loading, data]
}

export default useMutation