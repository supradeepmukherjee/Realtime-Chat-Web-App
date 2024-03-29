import { Avatar as Chavi, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/admin/Layout"
import ChaviCard from '../../components/shared/ChaviCard'
import Table from "../../components/shared/Table"
import { dashboardData } from "../../constants/sample"
import { transformImg } from '../../lib/features'

const cols = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'tableHeader',
    width: 200,
  },
  {
    field: 'chavi',
    headerName: 'Chavi',
    headerClassName: 'tableHeader',
    width: 150,
    renderCell: params => <ChaviCard chavi={params.row.chavi} />
  },
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: 'tableHeader',
    width: 300,
  },
  {
    field: 'totalMembers',
    headerName: 'Total Members',
    headerClassName: 'tableHeader',
    width: 120,
  },
  {
    field: 'members',
    headerName: 'Members',
    headerClassName: 'tableHeader',
    width: 400,
    renderCell: params => <ChaviCard chavi={params.row.members} max={100} />
  },
  {
    field: 'totalMsgs',
    headerName: 'Total Messages',
    headerClassName: 'tableHeader',
    width: 120,
  },
  {
    field: 'creator',
    headerName: 'Created By',
    headerClassName: 'tableHeader',
    width: 250,
    renderCell: params => (
      <Stack className='!flex-row items-center gap-4'>
        <Chavi alt={params.row.creator.name} src={params.row.creator.chavi} />
        <span>
          {params.row.creator.name}
        </span>
      </Stack>
    )
  },
]

const Chats = () => {
  const [rows, setRows] = useState([])
  useEffect(() => {
    setRows(dashboardData.chats.map(chat => ({
      ...chat,
      id: chat._id,
      chavi: chat.chavi.map(c => transformImg(c, 50)),
      members: chat.members.map(m => transformImg(m.chavi, 50)),
      creator: {
        name: chat.creator.name,
        chavi: transformImg(chat.creator.chavi, 50)
      }
    })))
  }, [])
  return (
    <Layout>
      <Table title={'All Chats'} rows={rows} cols={cols} />
    </Layout>
  )
}

export default Chats