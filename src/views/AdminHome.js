import React, {useState, useEffect} from 'react'
import {Card, Input, DatePicker, Row, Col, Tooltip, Select, Button, Modal, Menu} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import moment from 'moment'
const {Option} = Select
const {TextArea} = Input

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
const dateString = (date) => {
    return date.toISOString().substring(0, date.toISOString().indexOf("T"))
}
const filterPasses = (passArr, filters) => {
    return passArr.filter(pass => 
        pass.student_name.toLowerCase().indexOf(filters.student_name?.toLowerCase()) != -1 &&
        pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
        pass.id.toLowerCase().indexOf(filters.id?.toLowerCase()) != -1 &&
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
        id: "",
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
    
    const isFormFilled = (form) => {
        return (
            form.teacher_name && form.student_name 
            && form.date && form.description
        )
    }

    const createModal = () => (
        <Modal
            title="Create Pass"
            visible={createVisibility} 
            onCancel={() => {
                setCreateVisibility(false);
                clearCreateForm()
            }}
            onOk={() => {
                if (isFormFilled(createForm)) {
                    setCreateVisibility(false);
                    setPassData({passes: [...passData.passes, createForm]})
                    clearCreateForm()
                }
            }}
            okText="Create"
        >
            <DatePicker
                style={{marginBottom: "10px", width:"100%"}}
                placeholder="Date"
                value={moment(createForm.date, 'YYYY-MM-DD')}
                onChange={(e) =>{
                    setCreateForm({...createForm, date: dateString(e)});
                }}
            />
            <Input
                style={{marginBottom: "10px"}}
                addonBefore={<div>Student</div>}
                value={createForm.student_name}
                onChange={(e) =>{
                    setCreateForm({...createForm, student_name: e.target.value});
                }}
            />
            <Input
                style={{marginBottom: "10px"}}
                addonBefore={<div>Teacher</div>}
                value={createForm.teacher_name}
                onChange = {(e) => {
                    setCreateForm({...createForm, teacher_name: e.target.value});
                }}
            />
            <Select
                style={{marginBottom: "10px", width:"100%", textAlign:"start"}} 
                value={createForm.status}
                onChange={(e) => {
                    setCreateForm({...createForm, status: e});
                }}
            >
                {[{val: 1, mess: "Issued And Used"},
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
            <TextArea
                placeholder="Description"
                style={{height:"150px", marginBottom:"5px"}}
                value={createForm.description}
                onChange = {(e) => {
                    setCreateForm({...createForm, description: e.target.value});
                }}
            />
            {!isFormFilled(createForm) && <div style={{color:"red"}}>*please fill out all sections</div>}
        </Modal>
    )
    const editModal = () => (
        <Modal
            title="Pass Information"
            visible={passVisibility != -1} 
            onOk={() => {
                if (isFormFilled(editForm)) {
                    setPassVisibility(-1)
                    const passArr = passData.passes
                    passArr[passVisibility] = editForm
                    setPassData({passes: passArr})
                }
            }}
            okText="Save"
            onCancel={() => {
                setPassVisibility(-1)
            }}
        >
            <DatePicker 
                value={moment(editForm.date, 'YYYY-MM-DD')}
                style={{width:"100%", margin:"5px 0"}}
                onChange= {(e) => {
                    setEditForm({date: dateString(e)});
                }}
            />
            <Input
                style={{margin:"5px 0"}}
                addonBefore={<div>Teacher</div>}
                value={editForm.teacher_name}
                onChange = {(e) => {
                    setEditForm({...editForm, teacher_name: e.target.value});
                }}
            />
            <Input
                style={{margin:"5px 0"}}
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
                {[{val: 1, mess: "Issued And Used"},
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
            <TextArea
                placeholder="Description"
                style={{margin:"5px 0 10px 0", height:"150px"}}
                value={editForm.description}
                onChange = {(e) => {
                    setEditForm({...editForm, description: e.target.value});
                }}
            />
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <Button danger
                    onClick={() => {
                        const passArr = passData.passes
                        passArr.splice(passVisibility, 1)
                        setPassData({passes: passArr})
                        setPassVisibility(-1)
                    }}
                >Delete</Button>
                {!isFormFilled(editForm) && <div style={{color:"red"}}>*please fill out all sections</div>}
            </div>
            
        </Modal>
    )

    return (
        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>

            <Menu mode='inline' style={{width:"340px"}}>
                <Menu.Item style={{marginTop:"20px", fontWeight:"600", fontSize:"20px"}}>History</Menu.Item>
                {getDates(passData.passes).map((d) =>
                    <>
                        <Menu.SubMenu title={d}>
                            {passData.passes.filter(item => item.date == d).map((pass) =>
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
                    {passData.passes.map( (pass, index) => 
                        <>
                            {passFilter(filters, pass) &&
                                <Col span={24/cols}>
                                    <Card 
                                        style={{
                                            borderColor:"#dfdfdf", borderRadius:"10px",
                                            textAlign:"start", fontSize:"16px"
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
                
                
                {editModal()}
                {createModal()}
                
            </div>
        </div>
    )
}

export default AdminHome
