import { } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid } from '@mui/material'

const Layout = () => WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return p => {
        return (
            <>
                <Title />
                <Header />
                <Grid container height={'calc(100vh - 4rem)'}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block'
                            }
                        }}
                        height='100%'>

                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height='100%'>
                        <WrappedComponent {...p} />
                    </Grid>
                    <Grid
                        item
                        md={4}
                        lg={3}
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'block'
                            },
                            p: '2rem',
                            bgcolor: 'rgba(0,0,0,.8)'
                        }}
                        height='100%'>

                    </Grid>
                </Grid>
            </>)
    }
}

export default Layout