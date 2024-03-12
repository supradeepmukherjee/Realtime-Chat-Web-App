import { Helmet } from 'react-helmet-async'

const Title = ({ title = 'Chat', desc = 'This is a real time Chat' }) => {
    return (
        <Helmet>
            <title>
                {title}
            </title>
            <meta name="description" content={desc} />
        </Helmet>
    )
}

export default Title