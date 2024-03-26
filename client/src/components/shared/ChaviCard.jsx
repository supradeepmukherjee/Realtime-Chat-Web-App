import { Avatar as Chavi, AvatarGroup as ChaviGrp } from "@mui/material"
import { transformImg } from "../../lib/features"

const ChaviCard = ({ chavi, max = 3 }) => {
    return (
        <div className='w-20 h-12'>
            <ChaviGrp max={max} className='relative'>
                {chavi.map((src, i) => <Chavi
                    src={transformImg(src)}
                    key={i}
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
            </ChaviGrp>
        </div>
    )
}

export default ChaviCard