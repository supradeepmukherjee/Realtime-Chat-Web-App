import { useState } from "react"
import Layout from "../../components/layout/admin/Layout"
import Table from "../../components/shared/Table"

const cols = [{
  field: 'ID',
  headerName: 'ID',
  headerClassName: 'tableHeader' // required for styling
}]

const Users = () => {
  const [rows, setRows] = useState([])
  return (
    <Layout>
      <Table title={'All Users'} rows={rows} cols={cols} />
    </Layout>
  )
}

export default Users