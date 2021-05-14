import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import moment from 'moment'

import DataContext from '../contexts/DataContext'
import CreatePassModal from './CreatePassModal'
import EditPassModal from './EditPassModal'

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
    
    
    const [cols, setCols] = useState(Math.floor(window.innerWidth/500))
    window.onresize = () => {setCols(Math.floor(window.innerWidth/500))}



    return (
        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>

            <Menu mode='inline' style={{width:"340px"}}>
                <Menu.Item style={{marginTop:"20px", fontWeight:"600", fontSize:"20px"}}>History</Menu.Item>
                {getDates(dataContext.passes).map((d) =>
                    <>
                        <Menu.SubMenu title={d}>
                            {dataContext.passes.filter(item => item.date == d).map((pass) =>
                                <Menu.Item
                                    onClick={() => {
                                        var parts = pass.date.split('-');
                                        setFilters({
                                            ...filters,
                                            date: dateString(new Date(parts[0], parts[1] - 1, parts[2])),
                                            teacher_name: pass.teacher_name,
                                            student_name: pass.student_name,
                                            status: pass.status,
                                            id: pass.id
                                        })
                                    }}
                                >{pass.teacher_name}</Menu.Item>
                            )}
                        </Menu.SubMenu>
                    </>
                )}
            </Menu>

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



                {/* pass results */}
                <Row gutter={[16,16]} width={{width:"100% !important"}}>
                    {dataContext.passes.map( (pass, index) => 
                        <>
                            {adminPassFilter(filters, pass) &&
                                <Col span={24/cols}>
                                    <Tooltip title="Click to View or Edit" color="white" placement="bottom">
                                        <Card 
                                            hoverable
                                            style={{
                                                borderColor:"#dfdfdf", borderRadius:"10px",
                                                textAlign:"start", fontSize:"16px"
                                            }} 
                                            onClick={() => {
                                                setPassVisibility(index)
                                            }}
                                        >   
                                            <div style={{marginBottom:"20px", display:"flex", justifyContent:"space-between", textAlign:"start", alignItems:"center"}}>
                                                <div>Date: {pass.date}</div>
                                                <Tooltip title={statusColorAndDesc(pass.status)[1]} color="white" style={{border:"5px solid black"}}>
                                                    <div style={dotStyle(pass.status, 16)}></div>
                                                </Tooltip>
                                            </div>
                                            <div style={{marginBottom:"10px"}}>Student: {pass.student_name}</div>
                                            <div>Teacher: {pass.teacher_name}</div>
                                        </Card>
                                    </Tooltip>
                                </Col>
                            }
                        </>
                    )}
                </Row>
                
            </div>
        </div>
    )
}

export default AdminHome
