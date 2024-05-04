import { Avatar as Chavi, Box, Stack } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/admin/Layout"
import { Loader } from "../../components/layout/Loader"
import RenderAttachment from '../../components/shared/RenderAttachment'
import Table from "../../components/shared/Table"
import useErrors from "../../hooks/useErrors"
import { fileFormat, transformImg } from '../../lib/features'
import { useGetAdminMsgsQuery } from "../../redux/api"

const cols = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'tableHeader',
    width: 200,
  },
  {
    field: 'attachments',
    headerName: 'Attachments',
    headerClassName: 'tableHeader',
    width: 200,
    renderCell: params => {
      const { attachments } = params.row
      return attachments.length > 0 ?
        attachments.map(({ url, publicID }) => {
          const file = fileFormat(url)
          console.log(url)
          return (
            <Box key={publicID}>
              <a download href={url} target='_blank'>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          )
        })
        :
        'No Attachments'
    }
  },
  {
    field: 'content',
    headerName: 'Content',
    headerClassName: 'tableHeader',
    width: 400,
    renderCell: params => {
      console.log(params.row)
      return (
        params.row.content === '' ?
          'No Text'
          :
          <span>
            {params.row.content}
          </span>
      )
    }
  },
  {
    field: 'sender',
    headerName: 'Sent By',
    headerClassName: 'tableHeader',
    width: 200,
    renderCell: params => (
      <Stack className='!flex-row gap-4 items-center'>
        <Chavi alt={params.row.sender.name} src={params.row.sender.chavi} />
        <span>
          {params.row.sender.name}
        </span>
      </Stack>
    )
  },
  {
    field: 'chat',
    headerName: 'Chat',
    headerClassName: 'tableHeader',
    width: 220,
  },
  {
    field: 'grpChat',
    headerName: 'Group',
    headerClassName: 'tableHeader',
    width: 100,
  },
  {
    field: 'createdAt',
    headerName: 'Time',
    headerClassName: 'tableHeader',
    width: 250,
  },
]

const Msgs = () => {
  const [rows, setRows] = useState([])
  const { isLoading, data, error, isError } = useGetAdminMsgsQuery()
  useErrors([{ error, isError }])
  useEffect(() => {
    if (data)
      setRows(data.msgs.map(msg => ({
        ...msg,
        id: msg._id,
        sender: {
          name: msg.sender.name,
          chavi: transformImg(msg.sender.chavi, 50)
        },
        createdAt: moment(msg.createdAt).format('MMMM Do YYYY, h:mm:ss a')
      })))
  }, [data])
  return (
    <Layout>
      {isLoading ?
        <Loader /> :
        <Table title={'All Messages'} rows={rows} cols={cols} rowHeight={200} />}
    </Layout>
  )
}

export default Msgs