import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import moment from 'moment'

import DataContext from '../contexts/DataContext'
import {dateString, dotStyle, isFormFilled} from '../Functions'

import {Input, DatePicker, Select, Modal} from 'antd'
import {FieldTimeOutlined} from '@ant-design/icons'
const {Option} = Select
const {TextArea} = Input



const CreatePassModal = ({visible, setVisible}) => {

    const {dataContext, setDataContext} = useContext(DataContext)
    const currDate = new Date()

    const [createForm, setCreateForm] = useState({
        student_name: "",
        teacher_name: "",
        for_time: "",
        date: dateString(currDate),
        status: -1,
        description: ""
    });
    const clearCreateForm = () => {
        setCreateForm({
            student_name: "", teacher_name: "",
            date: dateString(currDate), for_time: "",
            status: -1, description: ""
        })
    }


    const createPass = async() => {
        try {
            const createRes = await axios.post(`${process.env.REACT_APP_PASS_API}/create`, createForm)
            const getRes = await axios.get(`${process.env.REACT_APP_PASS_API}/`)
            setDataContext({passes: getRes.data.passes})
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <Modal
            title="Create Pass"
            visible={visible} 
            onCancel={() => {
                setVisible(false);
                clearCreateForm()
            }}
            onOk={() => {
                if (isFormFilled(createForm)) {
                    setVisible(false);
                    createPass()
                }
            }}
            okText="Create"
        >
            <div style={{display:"flex", marginBottom:"5px"}}>
                <DatePicker
                    allowClear={false}
                    style={{marginRight: "5px"}}
                    placeholder="Date"
                    value={moment(createForm.date, 'YYYY-MM-DD')}
                    onChange={(e) =>{
                        setCreateForm({...createForm, date: dateString(e)});
                    }}
                />
                <Input
                    style={{width:"150px"}}
                    suffix={<FieldTimeOutlined style={{color: "#bbbbbb", fontSize:"15px"}}/>}
                    value={createForm.for_time}
                    onChange = {(e) => {
                        setCreateForm({...createForm, for_time: e.target.value});
                    }}
                />
            </div>
            
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
}

export default CreatePassModal
