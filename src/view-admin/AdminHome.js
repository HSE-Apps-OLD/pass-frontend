import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import moment from 'moment'

import DataContext from '../contexts/DataContext'
import PassCards from '../shared-components/PassCards'
import CreatePassModal from './CreatePassModal'
import EditPassModal from './EditPassModal'
import History from '../shared-components/History'

import {Card, Input, DatePicker, Row, Col, Tooltip, Select, Button, Modal, Menu} from 'antd'
import {dateString, statusColorAndDesc, dotStyle, getDates, adminPassFilter, isFormFilled} from '../Functions'
import {PlusOutlined} from '@ant-design/icons'
const {Option} = Select
const {TextArea} = Input



const AdminHome = () => {

    const {dataContext, setDataContext} = useContext(DataContext)

    const currDate = new Date()
    const [filters, setFilters] = useState({
        id: "",
        student_name: "",
        teacher_name: "",
        date: dateString(currDate),
        status: 2
    })
    
    const [createVisibility, setCreateVisibility] = useState(false);
    const [passVisibility, setPassVisibility] = useState(-1);
    


    return (
        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>


            <History filters={filters} setFilters={setFilters}/>

            <EditPassModal visible={passVisibility} setVisible={setPassVisibility}/>
            <CreatePassModal visible={createVisibility} setVisible={setCreateVisibility}/>
        

            <div style={{
                fontSize: "200px", textAlign: "center",
                paddingBottom: "800px", width:"100%",
                display: "flex", alignItems: "center", flexDirection: "column"
            }}>

                <div style={{display:"flex", width:"100%", marginBottom:"30px"}}>
                    <Tooltip title="Create Pass" color="white" placement="right">
                        <Button 
                            style={{margin:"5px 0 0 5px"}}
                            onClick={() => {setCreateVisibility(true)}}
                        ><PlusOutlined/></Button>
                    </Tooltip>
                </div>


                {/* search filters */}
                <div style={{width:"80%", fontSize:"20px", marginBottom:"10px"}}>
                    <DatePicker 
                        value={moment(filters.date, 'YYYY-MM-DD')}
                        style={{width:"100%", marginBottom:"5px"}} size="large"
                        onChange= {(e) => {
                            setFilters({...filters, date: dateString(e), id: ""});
                        }}
                    />
                    <Input
                        style={{marginBottom:"5px"}}
                        addonBefore={<div>Teacher</div>}
                        value={filters.teacher_name}
                        onChange = {(e) => {
                            setFilters({...filters, teacher_name: e.target.value, id: ""});
                        }}
                    />
                    <Input
                        style={{marginBottom:"5px"}}
                        addonBefore={<div>Student</div>}
                        value={filters.student_name}
                        onChange = {(e) => {
                            setFilters({...filters, student_name: e.target.value, id: ""});
                        }}
                    />
                    <Select
                        style={{marginBottom:"5px", width:"100%", textAlign:"start"}} 
                        value={filters.status}
                        onChange={(e) => {
                            setFilters({...filters, status: e, id: ""});
                        }}
                    >
                        {[{val: 2, mess: "Select Status"},
                        {val: 1, mess: "Issued And Used"},
                        {val: 0, mess: "Issued But Not Used"},
                        {val: -1, mess: "Not Issued"}].map(item => 
                                <Option value={item.val}>
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        {item.mess} &nbsp;<div style={dotStyle(item.val, 10)}></div>
                                    </div>
                                </Option>
                            )
                        }
                    </Select>
                </div>


                <PassCards
                    filters={filters}
                    tipText="Click to View and Edit"
                    setVisible={setPassVisibility}
                />

            </div>
        </div>
    )
}

export default AdminHome
