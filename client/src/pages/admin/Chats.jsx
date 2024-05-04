import { Avatar as Chavi } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/admin/Layout"
import { Loader } from "../../components/layout/Loader"
import Table from "../../components/shared/Table"
import useErrors from "../../hooks/useErrors"
import { transformImg } from '../../lib/features'
import ChaviCard from '../../components/shared/ChaviCard'
import { useGetAdminChatsQuery } from "../../redux/api"

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
    renderCell: params => <Chavi src={params.row.chavi} />
  },
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: 'tableHeader',
    width: 300,
  },
  {
    field: 'grpChat',
    headerName: 'Group',
    headerClassName: 'tableHeader',
    width: 100,
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
    field: 'admin',
    headerName: 'Admin',
    headerClassName: 'tableHeader',
    width: 250,
    renderCell: params => <ChaviCard chavi={params.row.admin} max={100} />
  },
]

const Chats = () => {
  const [rows, setRows] = useState([])
  const { isLoading, data, error, isError } = useGetAdminChatsQuery()
  useErrors([{ error, isError }])
  useEffect(() => {
    if (data)
      setRows(data.chats.map(chat => ({
        ...chat,
        id: chat._id,
        chavi: chat.grpChat?.chavi ? transformImg(chat.chavi, 50) : null,
        members: chat.members?.map(m => transformImg(m.chavi, 50)),
        admin: chat.admin?.map(a => transformImg(a.chavi, 50)),
      })))
  }, [data])
  return (
    <Layout>
      {isLoading ?
        <Loader /> :
        <Table title={'All Chats'} rows={rows} cols={cols} />}
    </Layout>
  )
}

export default Chats