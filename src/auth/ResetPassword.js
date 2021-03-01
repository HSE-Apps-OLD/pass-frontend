import React, { useEffect,useState}from 'react'
import { CloseOutlined, LockOutlined, CheckCircleTwoTone, LoadingOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import {Link, useParams} from 'react-router-dom'
import { Card, Typography, Input, Button} from 'antd';
import logo from '../img/hsekey.png'
import axios from 'axios'
const {Title, Text} = Typography


const Verify = ({history}) => {
    const [loading,setLoading] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [error] = useState(false)

    const[formData, setFormData] = useState({email: ""})

    const [errors,setErrors] = useState([])



    const {token} = useParams('emailToken')


    useEffect(() => {
        document.title = "HSE Key | Signup"
    }, [])

    const handleForm = e => {
        setFormData({...formData, [e.target.id]: e.target.value})
     }

    const sendEmail = async () => {

        const { password, vpassword} = formData
        if(!password) {
            setErrors([{msg: "Please enter a valid password"}])
        } else if (!vpassword) {
            setErrors([{msg: "Please verify your password"}])
        } else if(vpassword !== password){
            setErrors([{msg: "Your passwords don't match"}])
        } else {
            try{
                setLoading(true)
                const body = {password, token}
                const res = await axios.put(`${process.env.REACT_APP_AUTH_API}/user/password/`, body)
                
                setLoading(false)
                setUpdated(true)

                
            } catch(err){
                setLoading(false)

                if(err.response?.data?.errors){
                    setErrors(err.response.data.errors)  
                } else {
                    setErrors([{msg: "Server Error"}])
                }
            }
        }
        setTimeout(() => setErrors([]), 2500)
       
            // try{
                
            //     const res = await axios.put(`${process.env.REACT_APP_AUTH_API}/user/password/reset`, {email: formData.email})

                
            //     setLoading(false)                
            //     setUpdated(true)

            // } catch(err){
            //     setLoading(false)
            //     setError(true)
            // }
    }
    return(
        <div style={{height: "100vh", width:"100vw", display: "flex", justifyContent: "center", alignItems:"center",  background: "#fafcff"}}>
        <Card style={{ width: 450, height: 350,borderRadius: "20px", background: "#fff", boxShadow: " 0px 8px 15px -2px rgba(0,0,0,0.1)" }}>
            <div style={{width: "100%",display: "flex", alignItems: "center", justifyContent: 'flex-start',flexDirection: "column"}}>
                <div style={{width: "78%", display: "flex",alignItems:"center", justifyContent: "space-between"}}>
                   <Title level={3} style={{color: "#444", paddingTop:"10px"}}>Password Reset</Title>
                   <img onClick={() => setLoading(!loading)} src={logo} alt={"rip"} style={{width: "calc(48px * 0.55)", height:"calc(50px * 0.55)"}}></img>
                </div>
               <br></br>
               {!updated ? 
               <>
               <Input.Password size="default"autoComplete="off" id="password" placeholder="Enter new password" onChange={handleForm} style={{borderRadius: "25px", height:"40px" ,width: "80% ",margin: "10px 0px 10px 0px"}} prefix={<LockOutlined style={{marginRight: "10px"}}/>} />
               <Input.Password size="default"autoComplete="off" id="vpassword" placeholder="Verify new password" onChange={handleForm} style={{borderRadius: "25px", height:"40px" ,width: "80% ",margin: "10px 0px 15px 0px"}} prefix={<LockOutlined style={{marginRight: "10px"}}/>} /> 
               {errors.length > 0 ? 
                        <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center"}}>
                            <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> {errors[0].msg} </Text>
                        </div>
                     :
                        <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center", visibility: "hidden"}}>
                            <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> Error </Text>
                        </div>
                    }              
               <Button loading={loading} type="primary" block onClick={sendEmail} style={{borderRadius: "25px",height:"40px" , width: "80% ",margin: "15px 0px 15px 0px"}}>Update Password</Button>
               </>
                :
                <>
               {loading ? 
                <>
                    <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'center', marginTop: '60px'}}>
                        <LoadingOutlined style={{fontSize: '35px', color: "#1890ff"}}></LoadingOutlined>                            
                    </div>

                </>
               : 
                !error ?
                    <>
                        <div style={{display:'flex', alignItems: 'center', width: '38%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CheckCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#52c41a" />
                            <Text > Password Changed </Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/login`}>Go to Login</Link></Text>
                    </>
                    :
                    <>
                        <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CloseCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#ff4d4f" />
                            <Text> Server Error </Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/login`}>Go to Login</Link></Text>
                    </>
               }
               </>
                }
            </div>
        </Card>
   </div>
    )
}


export default Verify