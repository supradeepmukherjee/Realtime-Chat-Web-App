import { Avatar, AvatarGroup, Box, Stack } from "@mui/material"

const ChaviCard = ({ chavi, max = 3 }) => {
    return (
        <Stack spacing={.5}>
            <AvatarGroup>
                <Box className='w-20 h-12'>
                    {chavi.map((src, i) => <Avatar
                        src={src}
                        key={src}
                        alt={`Chavi ${i}`}
                        sx={{
                            width: '3rem',
                            height: '3rem',
                            position: 'absolute',
                            left: {
                                xs: `${.5 + i}rem`,
                                sm: `${i}rem`
                            }
                        }}
                    />)}
                </Box>
            </AvatarGroup>
        </Stack>
    )
}

export default ChaviCard