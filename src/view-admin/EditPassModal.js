import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import moment from 'moment'

import DataContext from '../contexts/DataContext'
import {dateString, dotStyle, isFormFilled} from '../Functions'

import {Input, DatePicker, Select, Modal, Button} from 'antd'
import {FieldTimeOutlined} from '@ant-design/icons'
const {Option} = Select
const {TextArea} = Input



const EditPassModal = ({visible, setVisible}) => {

    const {dataContext, setDataContext} = useContext(DataContext)
    const currDate = new Date()

    const [editForm, setEditForm] = useState({
        student_name: "",
        teacher_name: "",
        for_time: "",
        date: dateString(currDate),
        status: -1,
        description: ""
    });

    useEffect(() => {
        if (visible != -1) {
            setEditForm(dataContext.passes[visible])
        }
    }, [visible])


    const editPass = async() => {
        const editRes = await axios.put(`${process.env.REACT_APP_PASS_API}/edit`, editForm)
        const getRes = await axios.get(`${process.env.REACT_APP_PASS_API}/`)
        setDataContext({passes: getRes.data.passes})
    }



    return (
        <Modal
            title="Pass Information"
            visible={visible != -1} 
            okText="Save"
            onOk={() => {
                if (isFormFilled(editForm)) {
                    setVisible(-1)
                    editPass()
                }
            }}
            onCancel={() => {
                setVisible(-1)
            }}
        >
            
            <div style={{display:"flex", marginBottom:"5px"}}>
                <DatePicker
                    allowClear={false}
                    value={moment(editForm.date, 'YYYY-MM-DD')}
                    style={{marginRight:"5px"}}
                    onChange= {(e) => {
                        setEditForm({...editForm, date: dateString(e)});
                    }}
                />
                <Input
                    style={{width:"150px"}}
                    suffix={<FieldTimeOutlined style={{color: "#bbbbbb", fontSize:"15px"}}/>}
                    value={editForm.for_time}
                    onChange = {(e) => {
                        setEditForm({...editForm, for_time: e.target.value});
                    }}
                />
            </div>

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
                        // const passArr = dataContext.passes
                        // passArr.splice(passVisibility, 1)
                        // setDataContext({passes: passArr})
                        // setPassVisibility(-1)
                    }}
                >Delete</Button>
                {!isFormFilled(editForm) && <div style={{color:"red"}}>*please fill out all sections</div>}
            </div>
            
        </Modal>
    )
}

export default EditPassModal
