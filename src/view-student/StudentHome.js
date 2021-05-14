import React, {useState, useContext, useEffect} from 'react'
import moment from 'moment'

import DataContext from '../contexts/DataContext'
import AuthContext from '../auth/AuthContext.js'
import PassRequestModal from './PassRequestModal'
import History from '../shared-components/History'

import {dateString, statusColorAndDesc, dotStyle, getDates, studentPassFilter} from '../Functions'

import {Card, Menu, Input, DatePicker, Row, Col, Tooltip, Select, Button, Modal} from 'antd'
import {MailOutlined} from '@ant-design/icons'
const {Option} = Select
const {TextArea} = Input



const StudentHome = () => {

    const {dataContext, setDataContext} = useContext(DataContext)
    const [filters, setFilters] = useState({
        date: new Date(), for_time: "",
        teacher_name: "", status: 2,
        _id: ""
    })
    const [passVisibility, setPassVisibility] = useState(-1);
    const [passReqVis, setPassReqVis] = useState(false);
    

    const [cols, setCols] = useState(Math.floor(window.innerWidth/500))
    window.onresize = () => {setCols(Math.floor(window.innerWidth/500))}


    
    const addDaysButton = (increment) => (
        <Button
            style={{height:"39px"}}
            onClick={() => {
                var d = new Date(filters.date);
                d.setDate(filters.date.getDate() + increment);
                setFilters({...filters, date: d, description:""})
            }}
        >
            {increment>0 && "+"}{increment}
        </Button>
    )
    const passView = (pass) => (
        <Modal 
            title="Pass Information" 
            visible={passVisibility != -1} 
            onOk={() =>{setPassVisibility(-1)}} okType="ghost"
            onCancel={() =>{setPassVisibility(-1)}}
        >
            <div style={{marginBottom:"10px"}}>Date: {pass.date}</div>
            <div>Teacher: {pass.teacher_name}</div>
            <div style={{marginBottom:"10px"}}>Student: {pass.student_name}</div>
            <div style={{marginBottom:"20px"}}>Description: {pass.description}</div>
            <div>Status: {statusColorAndDesc(pass.status)[1]}</div>
        </Modal>
    )
    


    return (
        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>


            <History filters={filters} setFilters={setFilters}/>
            {passVisibility != -1 && passView(dataContext.passes[passVisibility])}
            <PassRequestModal visible={passReqVis} setVisible={setPassReqVis}/>


            <div style={{
                fontSize: "200px", textAlign: "center", width:"100%",
                paddingBottom: "800px",
                display: "flex", alignItems: "center", flexDirection: "column"
            }}>
                
                <div style={{display:"flex", width:"100%", marginBottom:"30px"}}>
                    <Tooltip title="Request Pass" color="white" placement="right">
                        <Button 
                            style={{margin:"5px 0 0 5px"}}
                            onClick={() => {setPassReqVis(!passReqVis)}}
                        ><MailOutlined/></Button>
                    </Tooltip>
                </div>
                

                <div style={{width:"80%", fontSize:"20px", marginBottom:"20px"}}>
                    <div style={{display:"flex", alignItems:"center"}}>
                        {addDaysButton(-7)}
                        <div style={{marginLeft:"5px"}}>{addDaysButton(-1)}</div>
                        <DatePicker 
                            value={moment(filters.date, 'YYYY-MM-DD')}
                            style={{width:"100%", margin:"0 5px"}} size="large"
                            onChange= {(e) => {setFilters({...filters, date: e.toDate(), _id:""})}}
                        />
                        <div style={{marginRight:"5px"}}>{addDaysButton(1)}</div>
                        {addDaysButton(7)}
                    </div>
                    <Input placeholder="Teacher Name" value={filters.teacher_name}
                        onChange={(e) => {
                            setFilters({...filters, teacher_name: e.target.value, _id:""});
                        }}
                    />
                    <Select
                        style={{width:"100%", textAlign:"start"}} 
                        value={filters.status}
                        onChange={(e) => {setFilters({...filters, status: e, _id:""})}}
                    >
                        {[{val: 2, mess: "Any Status"},
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


                {dataContext.passes.filter(item => studentPassFilter(item, filters)).length != 0?
                    <Row gutter={[16,16]} width={{width:"100% !important"}}>
                        {dataContext.passes.map( (pass, index) => 
                            <>
                                {studentPassFilter(pass, filters) &&
                                    <Col span={24/cols}>
                                        <Tooltip title="Click to View or Edit" color="white" placement="bottom">
                                            <Card 
                                                hoverable
                                                style={{
                                                    borderColor:"#dfdfdf", borderRadius:"10px",
                                                    textAlign:"start", fontSize:"16px"
                                                }}
                                                onClick={() => {setPassVisibility(index)}}
                                            >   
                                                <div style={{
                                                    marginBottom:"20px", display:"flex",
                                                    justifyContent:"space-between", textAlign:"start", alignItems:"center"
                                                }}>
                                                    <div>Date: {pass.date}</div>
                                                    <Tooltip
                                                        title={statusColorAndDesc(pass.status)[1]}
                                                        color="white" style={{border:"5px solid black"}}
                                                    >
                                                        <div style={dotStyle(pass.status, 16)}></div>
                                                    </Tooltip>
                                                </div>
                                                <div>Teacher: {pass.teacher_name}</div>
                                            </Card>
                                        </Tooltip>
                                        
                                    </Col>
                                }
                            </>
                        )}
                    </Row>
                :
                    <div style={{fontSize:"16px", display:"flex", justifyContent:"center", marginTop:"25px"}}>
                        No passes were found with these attributes.
                    </div>
                }
            </div>


        </div>
    )
}

export default StudentHome