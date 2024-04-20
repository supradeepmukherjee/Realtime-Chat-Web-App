import { keyframes, Skeleton, styled } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const HiddenInput = styled('input')({
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

const Link = styled(RouterLink)({
    color: '#000',
    textDecoration: 'none',
    padding: '1rem',
    '&:hover': { backgroundColor: '#f0f0f0' }
})

const InputBox = styled('input')({
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '0 1rem',
    borderRadius: '1.5rem',
    backgroundColor: '#f7f7f7'
})

const SearchField = styled('input')({
    width: '20vmax',
    border: 'none',
    outline: 'none',
    padding: '.6rem 1.5rem',
    borderRadius: '1.5rem',
    backgroundColor: '#f7f7f7',
})

const Button = styled('button')({
    borderRadius: '1.5rem',
    padding: '.6rem 1.5rem',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': { backgroundColor: 'rgba(0,0,0,.7)' }
})

const bounce = keyframes`
    0%{transform:scale(1);}
    50%{transform:scale(1.5);}
    100%{transform:scale(1);}
`

const BouncingSkeleton = styled(Skeleton)({
    animation: `${bounce} 1s infinite`,
    backgroundColor: 'green'
})

export { Button, HiddenInput, InputBox, Link, SearchField, BouncingSkeleton }