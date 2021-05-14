import React, {useState, useContext} from 'react'

import DataContext from '../contexts/DataContext'
import AuthContext from '../auth/AuthContext.js'

import {dateString, getDates} from '../Functions'

import {Menu} from 'antd'



const History = ({filters, setFilters}) => {

    
    const {dataContext, setDataContext} = useContext(DataContext)
    const {auth, setAuth} = useContext(AuthContext)


    return (
        <Menu mode='inline' style={{width:"340px"}}>

            <Menu.Item style={{marginTop:"20px", fontWeight:"600", fontSize:"20px"}}>History</Menu.Item>

            {getDates(dataContext.passes).map((d) =>
                <Menu.SubMenu title={d}>
                    {dataContext.passes.filter(item => item.date == d).map((pass) =>
                        <Menu.Item
                            onClick={() => {
                                var parts = pass.date.split('-');
                                if (auth.user.role == "teacher") {
                                    setFilters({
                                        ...filters,
                                        date: dateString(new Date(parts[0], parts[1] - 1, parts[2])),
                                        teacher_name: pass.teacher_name,
                                        student_name: pass.student_name,
                                        status: pass.status,
                                        id: pass.id
                                    })
                                } else if (auth.user.role == "student") {
                                    setFilters({
                                        ...filters,
                                        date: new Date(parts[0], parts[1] - 1, parts[2]),
                                        for_time: pass.for_time,
                                        teacher_name: pass.teacher_name,
                                        status: pass.status,
                                        _id: pass._id
                                    })
                                }
                            }}
                        >
                            {pass.teacher_name}
                        </Menu.Item>
                    )}
                </Menu.SubMenu>
            )}

        </Menu>
    )
}

export default History
