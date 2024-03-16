import { Grid, Skeleton, Stack } from "@mui/material"

export const Loader = () => {
    return (
        <Grid container spacing={2.4}>
            <Grid
                item
                sm={4}
                md={3}
                sx={{
                    display: {
                        xs: 'none',
                        sm: 'block'
                    }
                }}>
                <Skeleton height={'100vh'} />
            </Grid>
            <Grid item xs={12} sm={8} md={5} lg={6}>
                <Stack spacing={2.4}>
                    {Array.from({ length: 12 }).map((_, i) => <Skeleton height={'4.2rem'} key={i} />)}
                </Stack>
            </Grid>
            <Grid
                item
                md={4}
                lg={3}
                sx={{
                    display: {
                        xs: 'none',
                        md: 'block'
                    }
                }}>
                <Skeleton height={'100vh'} />
            </Grid>
        </Grid>
    )
}
