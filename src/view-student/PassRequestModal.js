import React, {useState, useContext} from 'react'
import moment from 'moment'
import axios from 'axios'

import DataContext from '../contexts/DataContext'
import AuthContext from '../auth/AuthContext.js'
import {dateString, isRequestFilled} from '../Functions'

import {Input, DatePicker, Modal} from 'antd'
import {FieldTimeOutlined} from '@ant-design/icons'
const {TextArea} = Input



const PassRequest = ({visible, setVisible}) => {

    const {dataContext, setDataContext} = useContext(DataContext)
    const {auth, setAuth} = useContext(AuthContext)

    const [reqPass, setReqPass] = useState({
        date: new Date(), for_time: "",
        teacher_name: "", description: ""
    })


    const requestPass = async() => {
        const createRes = await axios.post(`${process.env.REACT_APP_PASS_API}/create`, 
            {...reqPass, date: dateString(reqPass.date)}
        )
        const getRes = await axios.get(`${process.env.REACT_APP_PASS_API}/`)
        setDataContext({passes: getRes.data.passes})
    }



    return (
        <Modal
            title="Pass Request" 
            visible={visible}
            okType="ghost" okText="Request"
            onOk={() => {
                if (isRequestFilled(reqPass)) {
                    setVisible(false)
                    requestPass()
                }
            }}
            onCancel={() => {setVisible(false)}}
        >

            <div style={{display:"flex", marginBottom:"5px"}}>
                <DatePicker 
                    style={{marginRight:"5px"}}
                    allowClear={false}
                    placeholder="Date"
                    value={moment(reqPass.date, 'YYYY-MM-DD')}
                    onChange={(e) =>{
                        setReqPass({...reqPass, date: dateString(e)});
                    }}
                />
                <Input
                    style={{width:"150px"}}
                    suffix={<FieldTimeOutlined style={{color: "#bbbbbb", fontSize:"15px"}}/>}
                    value={reqPass.for_time}
                    onChange = {(e) => {
                        setReqPass({...reqPass, for_time: e.target.value});
                    }}
                />
            </div>
            
            <Input style={{marginBottom:"5px"}} addonBefore="Student" value={auth.user.name}/>
            
            <Input
                style={{marginBottom:"5px"}}
                addonBefore="Teacher" 
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
            
            {!isRequestFilled(reqPass) && <div style={{color:"red"}}>*please fill out all sections</div>}

        </Modal>
    )
}

export default PassRequest
