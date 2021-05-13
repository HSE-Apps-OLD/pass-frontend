import React, {useState, useContext, useEffect} from 'react'
import {Card, Menu, Input, DatePicker, Row, Col, Tooltip, Select, Button, Modal} from 'antd'
import {recentPasses} from '../mockData'
import moment from 'moment'
import AuthContext from '../auth/AuthContext.js'
import { SearchOutlined, MailOutlined } from '@ant-design/icons'
const {Option} = Select
const {TextArea} = Input


const dateString = (date) => {
    return date.toISOString().substring(0, date.toISOString().indexOf("T"))
}

const statusColorAndDesc = (status) => {
    if (status == 1) {return ['#52c41a', 'This pass has been both issued and used!']}
    else if (status == 0) {return ['#fadb14', 'This pass has been issued, but not used.']}
    else if (status == -1) {return ['#ff4d4f', 'This pass has not yet been issued.']}
    else {return ['lightgray', 'Unknown Status']}
}
const dotStyle = (status, size) => { 
    return {height: size+"px", width: size+"px", borderRadius: size/2+"8px", backgroundColor: statusColorAndDesc(status)[0]}
}
const getDates = (passArr) => {
    const dateArr = []
    for (var x of passArr) {
        if (dateArr.indexOf(x.date) == -1) {
            dateArr.push(x.date)
        }
    }
    dateArr.sort((a,b) => a.localeCompare(b))
    return dateArr
}



const StudentHome = () => {

    const {auth, setAuth} = useContext(AuthContext)

    const [filters, setFilters] = useState({
        date: new Date(),
        teacher_name: "",
        status: 2,
        id: ""
    })
    const [reqPass, setReqPass] = useState({
        date: new Date(),
        teacher_name: "",
        description: "",
        id: ""
    })

    const [cols, setCols] = useState(Math.floor(window.innerWidth/500))
    window.onresize = () => {setCols(Math.floor(window.innerWidth/500))}

    const [passVisibility, setPassVisibility] = useState(-1);
    const [passReqVis, setPassReqVis] = useState(false);

    const isFormFilled = (form) => {
        return (
            form.teacher_name && form.student_name 
            && form.date && form.description
        )
    }
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
    const passFilter = (pass) => {
        return (
            pass.id.toLowerCase().indexOf(filters.id?.toLowerCase()) != -1 &&
            pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
            pass.date == dateString(filters.date) &&
            (pass.status == filters.status || filters.status == 2)
        )
    }
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
    const passReqView = () => (
        <Modal
            title="Pass Request" 
            visible={passReqVis} 
            onOk={() => {
                if (isFormFilled(reqPass)) {
                    setPassReqVis(false)
                }
            }}
            okType="ghost" okText="Request"
            onCancel={() => {setPassReqVis(false)}}
        >
            <DatePicker 
                style={{marginBottom:"5px"}}
                placeholder="Date"
                value={moment(reqPass.date, 'YYYY-MM-DD')}
                onChange={(e) =>{
                    setReqPass({...reqPass, date: dateString(e)});
                }}
            />
            <Input style={{marginBottom:"5px"}} value={auth.user.name}/>
            <Input
                style={{marginBottom:"5px"}}
                prefix="Teacher Name" 
                value={reqPass.teacher_name}
                onChange = {(e) => {
                    setReqPass({...reqPass, teacher_name: e.target.value});
                }}
            />
            <TextArea
                placeholder="Description"
                style={{height:"150px", marginBottom:"5px"}}
                value={reqPass.description}
                onChange = {(e) => {
                    setReqPass({...reqPass, description: e.target.value});
                }}
            />
            {!isFormFilled(reqPass) && <div style={{color:"red"}}>*please fill out all sections</div>}
        </Modal>
    )



    return (
        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>

            <Menu mode='inline' style={{width:"340px"}}>
                <Menu.Item style={{marginTop:"20px", fontWeight:"600", fontSize:"20px"}}>History</Menu.Item>
                {getDates(recentPasses.passes).map((d) =>
                    <>
                        <Menu.SubMenu title={d}>
                            {recentPasses.passes.filter(item => item.date == d).map((pass) =>
                                <Menu.Item
                                    onClick={() => {
                                        var parts = pass.date.split('-');
                                        setFilters({
                                            ...filters,
                                            date: new Date(parts[0], parts[1] - 1, parts[2]),
                                            teacher_name: pass.teacher_name,
                                            status: pass.status,
                                            id: pass.id
                                        })
                                    }}
                                >{pass.teacher_name.length > 0? pass.teacher_name: "None"}</Menu.Item>
                            )}
                        </Menu.SubMenu>
                    </>
                )}
            </Menu>


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
                

                <div style={{
                    width:"80%", fontSize:"20px", marginBottom:"20px"
                }}>
                    <div style={{display:"flex", alignItems:"center"}}>
                        {addDaysButton(-7)}
                        <div style={{marginLeft:"5px"}}>{addDaysButton(-1)}</div>
                        <DatePicker 
                            value={moment(filters.date, 'YYYY-MM-DD')}
                            style={{width:"100%", margin:"0 5px"}} size="large"
                            onChange= {(e) => {setFilters({...filters, date: e.toDate(), id:""})}}
                        />
                        <div style={{marginRight:"5px"}}>{addDaysButton(1)}</div>
                        {addDaysButton(7)}
                    </div>
                    <Input placeholder="Teacher Name" value={filters.teacher_name}
                        onChange={(e) => {
                            setFilters({...filters, teacher_name: e.target.value, id:""});
                        }}
                    />
                    <Select
                        style={{width:"100%", textAlign:"start"}} 
                        value={filters.status}
                        onChange={(e) => {setFilters({...filters, status: e, id:""})}}
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


                {recentPasses.passes.filter(item => passFilter(item)).length != 0?
                    <Row gutter={[16,16]} width={{width:"100% !important"}}>
                        {recentPasses.passes.map( (pass, index) => 
                            <>
                                {passFilter(pass) &&
                                    <Col span={24/cols}>
                                        <Card 
                                            style={{
                                                borderColor:"#dfdfdf", borderRadius:"10px",
                                                textAlign:"start", fontSize:"16px"
                                            }} 
                                            hoverable onClick={() => {setPassVisibility(index)}}
                                        >   
                                            <div
                                                style={{
                                                    marginBottom:"20px", display:"flex",
                                                    justifyContent:"space-between", textAlign:"start", alignItems:"center"
                                                }}
                                            >
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
                                    </Col>
                                }
                            </>
                        )}
                    </Row>
                :
                    <div style={{fontSize:"16px", display:"flex", justifyContent:"center", marginTop:"25px"}}>
                        No passes were found for this date.
                    </div>
                }
                    
                {passVisibility != -1 && passView(recentPasses.passes[passVisibility])}
                {passReqView()}

            </div>

        </div>
        
    )
}

export default StudentHome