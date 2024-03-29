import { Container, Paper, Typography } from "@mui/material"
import { DataGrid } from '@mui/x-data-grid'

const Table = ({ rows, cols, title, rowHeight }) => {
    return (
        <Container className='h-screen'>
            <Paper elevation={3} className='py-4 px-16 rounded-2xl m-auto w-full overflow-hidden h-full'>
                <Typography variant='h4' className='text-center m-8 uppercase'>
                    {title}
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    rowHeight={rowHeight}
                    sx={{
                        height: '90%',
                        '.tableHeader': {
                            bgcolor: 'black',
                            color: 'white'
                        }
                    }}
                />
            </Paper>
        </Container>
    )
}

export default Table