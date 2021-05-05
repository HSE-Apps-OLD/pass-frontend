import React, {useState, useEffect} from 'react'
import {Card, Input, DatePicker, Row, Col, Tooltip, Select, Button, Modal} from 'antd'
import moment from 'moment'
const {Option} = Select
const {TextArea} = Input


const dateString = (date) => {
    return date.toISOString().substring(0, date.toISOString().indexOf("T"))
}
const filterPasses = (passArr, filters) => {
    return passArr.filter(pass => 
        pass.student_name.toLowerCase().indexOf(filters.student_name?.toLowerCase()) != -1 &&
        pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
        pass.date == filters.date &&
        (pass.status == filters.status || filters.status == 2)
    )
}
const passFilter = (filters, pass) => {
    return pass.student_name.toLowerCase().indexOf(filters.student_name?.toLowerCase()) != -1 &&
    pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
    pass.date == filters.date &&
    (pass.status == filters.status || filters.status == 2)
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



const AdminHome = () => {
    const currDate = new Date()
    const [filters, setFilters] = useState({
        student_name: "",
        teacher_name: "",
        date: dateString(currDate),
        status: 2
    })
    const [cols, setCols] = useState(Math.floor(window.innerWidth/500))
    window.onresize = () => {
        setCols(Math.floor(window.innerWidth/500))
    }
    const [createVisibility, setCreateVisibility] = useState(false);
    const [passVisibility, setPassVisibility] = useState(-1);
    const [createForm, setCreateForm] = useState({
        student_name: "",
        teacher_name: "",
        date: dateString(currDate),
        status: -1,
        description: ""
    });
    const [editForm, setEditForm] = useState({
        student_name: "",
        teacher_name: "",
        date: dateString(currDate),
        status: -1,
        description: ""
    });
    const clearCreateForm = () => {
        setCreateForm({
            student_name: "", teacher_name: "",
            date: dateString(currDate),
            status: -1, description: ""
        })
    }


    const [passData, setPassData] = useState(JSON.parse(localStorage.getItem("passData")))

    useEffect(() => {
        console.log(editForm)
    }, [editForm])
    

    return (
        <div style={{
            fontSize: "200px", textAlign: "center",
            paddingBottom: "1000px", paddingTop: "50px",
            display: "flex", alignItems: "center", flexDirection: "column"
        }}>

            {/* search filters */}
            <div style={{width:"70%", fontSize:"20px", marginBottom:"10px"}}>



                <Button style={{float: "right"}} 
                    onClick={() => {setCreateVisibility(true);}}
                >Create Pass
                </Button>

                <Modal title="Create Pass" visible={createVisibility} 
                    onCancel={() => {
                        setCreateVisibility(false);
                        clearCreateForm()
                    }}
                    onOk={() => {
                        setCreateVisibility(false);
                        setPassData({passes: [...passData.passes, createForm]})
                        clearCreateForm()
                    }}
                    okText={<div>Create</div>}
                >
                    <DatePicker placeholder="Date" value={moment(createForm.date, 'YYYY-MM-DD')}
                        onChange={(e) =>{
                            setCreateForm({...createForm, date: dateString(e)});
                        }}>
                    </DatePicker>
                    <Input placeholder="Student Name" value={createForm.student_name}
                        onChange={(e) =>{
                            setCreateForm({...createForm, student_name: e.target.value});
                        }}>
                    </Input>
                    <Input placeholder="Teacher Name"  value={createForm.teacher_name}
                        onChange = {(e) => {
                            setCreateForm({...createForm, teacher_name: e.target.value});
                        }}>
                    </Input>
                    <Input placeholder="Description" value={createForm.description}
                        onChange = {(e) => {
                            setCreateForm({...createForm, description: e.target.value});
                        }}
                    ></Input>
                    <Select
                        style={{margin:"5px 0", width:"100%", textAlign:"start"}} 
                        value={createForm.status}
                        onChange={(e) => {
                            setCreateForm({...createForm, status: e});
                        }}
                    >
                        <Option value={1}>
                            <div style={{display:"flex", alignItems:"center"}}>
                                Issued And Used &nbsp;<div style={dotStyle(1, 10)}></div>
                            </div>
                        </Option>
                        <Option value={0}>
                            <div style={{display:"flex", alignItems:"center"}}>
                                Issued But Not Used &nbsp;<div style={dotStyle(0, 10)}></div>
                            </div>
                        </Option>
                        <Option value={-1} >
                            <div style={{display:"flex", alignItems:"center"}}>
                                Not Issued &nbsp;<div style={dotStyle(-1, 10)}></div>
                            </div>
                        </Option>
                    </Select>
                </Modal>












                <DatePicker 
                    value={moment(filters.date, 'YYYY-MM-DD')}
                    style={{width:"100%", margin:"5px 0"}} size="large"
                    onChange= {(e) => {
                        setFilters({...filters, date: dateString(e)});
                    }}
                />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Teacher</div>}
                    value={filters.teacher_name}
                    onChange = {(e) => {
                        setFilters({...filters, teacher_name: e.target.value});
                    }}
                />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Student</div>}
                    value={filters.student_name}
                    onChange = {(e) => {
                        setFilters({...filters, student_name: e.target.value});
                    }}
                />
                <Select
                    style={{margin:"5px 0", width:"100%", textAlign:"start"}} 
                    value={filters.status}
                    onChange={(e) => {
                        setFilters({...filters, status: e});
                    }}
                >
                    <Option value={2}>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Select Status &nbsp;<div style={dotStyle(2, 10)}></div>
                        </div>
                    </Option>
                    <Option value={1}>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Issued And Used &nbsp;<div style={dotStyle(1, 10)}></div>
                        </div>
                    </Option>
                    <Option value={0}>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Issued But Not Used &nbsp;<div style={dotStyle(0, 10)}></div>
                        </div>
                    </Option>
                    <Option value={-1} >
                        <div style={{display:"flex", alignItems:"center"}}>
                            Not Issued &nbsp;<div style={dotStyle(-1, 10)}></div>
                        </div>
                    </Option>
                </Select>
            </div>

            {/* pass results */}
            <Row gutter={[16,16]} width={{width:"100% !important"}}>
                {passData.passes.map( (pass, index) => 
                    <>
                        {passFilter(filters, pass) &&
                            <Col span={24/cols}>
                                <Card 
                                    style={{
                                        borderColor:"#91d5ff", textAlign:"start",
                                        borderRadius:"10px", fontSize:"16px", borderWidth:"5px", 
                                    }} 
                                    hoverable onClick={() => {
                                        setPassVisibility(index)
                                        setEditForm(passData.passes[index])
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
                            </Col>
                        }
                    </>
                )}
            </Row>
            
            
            <Modal title="Pass Information" visible={passVisibility != -1} 
                onOk={() => {
                    setPassVisibility(-1)
                    const passArr = passData.passes
                    passArr[passVisibility] = editForm
                    setPassData({passes: passArr})
                }}
                onCancel={() => {setPassVisibility(-1)}}
            >
                <DatePicker 
                    value={moment(editForm.date, 'YYYY-MM-DD')}
                    style={{width:"100%", margin:"5px 0"}} size="large"
                    onChange= {(e) => {
                        setEditForm({date: dateString(e)});
                    }}
                />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Teacher</div>}
                    value={editForm.teacher_name}
                    onChange = {(e) => {
                        setEditForm({...editForm, teacher_name: e.target.value});
                    }}
                />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Student</div>}
                    value={editForm.student_name}
                    onChange = {(e) => {
                        setEditForm({...editForm, student_name: e.target.value});
                    }}
                />
                <Select
                    style={{margin:"5px 0", width:"100%", textAlign:"start"}} 
                    value={editForm.status}
                    onChange={(e) => {
                        setEditForm({...editForm, status: e});
                    }}
                >
                    <Option value={1}>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Issued And Used &nbsp;<div style={dotStyle(1, 10)}></div>
                        </div>
                    </Option>
                    <Option value={0}>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Issued But Not Used &nbsp;<div style={dotStyle(0, 10)}></div>
                        </div>
                    </Option>
                    <Option value={-1} >
                        <div style={{display:"flex", alignItems:"center"}}>
                            Not Issued &nbsp;<div style={dotStyle(-1, 10)}></div>
                        </div>
                    </Option>
                </Select>
                <TextArea
                    style={{margin:"5px 0", height:"150px"}} size="large"
                    value={editForm.description}
                    onChange = {(e) => {
                        setEditForm({...editForm, description: e.target.value});
                    }}
                />
            </Modal>
            
            
        </div>
    )
}

export default AdminHome
