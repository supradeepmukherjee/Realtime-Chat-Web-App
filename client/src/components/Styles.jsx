import { styled } from '@mui/material'

export const HiddenInput = styled('input')({
    border: 0,
    clipPath: 'circle(0%)',
    height: 1,
    width: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
})