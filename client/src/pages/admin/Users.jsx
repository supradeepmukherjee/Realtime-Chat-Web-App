import { Avatar as Chavi } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../../components/layout/admin/Layout"
import { Loader } from "../../components/layout/Loader"
import Table from "../../components/shared/Table"
import useErrors from "../../hooks/useErrors"
import { transformImg } from '../../lib/features'
import { useGetAdminUsersQuery } from "../../redux/api"

const cols = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'tableHeader', // required for styling
    width: 200,
  },
  {
    field: 'chavi',
    headerName: 'Chavi',
    headerClassName: 'tableHeader',
    width: 150,
    renderCell: params => <Chavi alt={params.row.name} src={params.row.chavi} />
  },
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: 'tableHeader',
    width: 200,
  },
  {
    field: 'uName',
    headerName: 'Username',
    headerClassName: 'tableHeader',
    width: 200,
  },
  {
    field: 'friends',
    headerName: 'Friends',
    headerClassName: 'tableHeader',
    width: 150,
  },
  {
    field: 'grps',
    headerName: 'Groups',
    headerClassName: 'tableHeader',
    width: 200,
  },
]

const Users = () => {
  const [rows, setRows] = useState([])
  const { isLoading, data, error, isError } = useGetAdminUsersQuery()
  useErrors([{ error, isError }])
  useEffect(() => {
    if (data)
      setRows(data.users?.map(user => ({
        ...user,
        id: user._id,
        chavi: transformImg(user.chavi, 50)
      })))
  }, [data])
  return (
    <Layout>
      {isLoading ?
        <Loader /> :
      <Table title={'All Users'} rows={rows} cols={cols} />}
    </Layout>
  )
}

export default Users