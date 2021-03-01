import React from 'react'

import {Card, Menu} from 'antd'

const SettingsNav = ({children, onClick}) => {


    return(
        <Card hoverable style={{borderRadius: "20px", padding: "0px"}}>
            <Menu
                mode="inline"
                style={{ borderRadius: "20px", border: "0px" }}
                selectable={false}
                onClick={(e) => onClick(e)}
            >
                {children}
            </Menu>
        </Card>
    )
}


export default SettingsNav