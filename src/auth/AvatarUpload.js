import React from 'react'

import {Avatar, Button, Badge, Upload} from 'antd'
import {UploadOutlined} from '@ant-design/icons'


const AvatarUpload = ({avatar, changeHandeler}) => {


    const props = {
        name: 'file',
        action: `${process.env.REACT_APP_AUTH_API}/static`,
        onChange(info) {
            changeHandeler(info)
        },
        showUploadList: false,
        
    }



    return(
        <Upload {...props} >
            <Badge offset={[-20, 10]} style={{background:"White"}} count={
                <Button style={{background:"White"}} shape="circle">
                    <UploadOutlined></UploadOutlined>
                </Button>
                    // <UploadOutlined style={{padding: "7px", borderRadius: "100px", boxShadow: "1px 1px 10px rgba(0,0,0,0.15)"}}></UploadOutlined>
            }>
                <Avatar size={100} style={{border: "0.5px solid #eee"}} src={avatar ? avatar : ""}></Avatar>
            </Badge>
        </Upload>
    )
}

export default AvatarUpload