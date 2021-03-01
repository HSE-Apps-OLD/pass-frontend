import React from 'react'
import {LoadingOutlined} from '@ant-design/icons'

const Loading = () => {
    return (
        <div style={{display:"flex", justifyContent:"center", width:"100%", paddingTop:"80px"}}>
            <LoadingOutlined style={{fontSize:"50px", color:"#afafaf"}}/>
        </div>
    )
}

export default Loading
