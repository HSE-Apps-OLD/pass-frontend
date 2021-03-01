import React, {useContext, useEffect,useState}from 'react'
import { UserOutlined, LockOutlined, CloseOutlined, MailOutlined } from '@ant-design/icons';
import {Link, useHistory} from 'react-router-dom'
import { Card, Typography, Input, Button} from 'antd';
import AuthContext from './AuthContext'
import logo from '../img/hsekey.png'
import axios from 'axios'
const {Title, Text} = Typography


const Signup = ({history}) => {
    const {setAuth} = useContext(AuthContext)
    const[formData, setFormData] = useState({email: "", password:"", vpassword: "", name: ""})
    const [errors,setErrors] = useState([])
    const[loading, setLoading] = useState(false)
    useEffect(() => {
        document.title = "HSE Key | Signup"
    }, [])

    const handleForm = e => {
        setFormData({...formData, [e.target.id]: e.target.value})
     }

     const redirect = (new URLSearchParams(useHistory().location.search)).get('redirect')

    const signup = async () => {
        const {email, password, vpassword, name} = formData
        if(!name){
            setErrors([{msg: "Please enter your name"}])
        } else if(!email) {
            setErrors([{msg: "Please enter a valid email"}])
        }else if(!password) {
            setErrors([{msg: "Please enter a valid password"}])
        } else if (!vpassword) {
            setErrors([{msg: "Please verify your password"}])
        } else if(vpassword !== password){
            setErrors([{msg: "Your passwords don't match"}])
        } else {
            try{
                setLoading(true)
                const body = {email: email, password: password, name: name}
                const res = await axios.post(`${process.env.REACT_APP_AUTH_API}/user/signup?timestamp=${new Date().getTime()}`, body)

                setAuth({user: null, toFetch: true, token: res.data})
                
                localStorage.setItem("token", res.data)
                if(redirect){
                    history.push(redirect)
                } else {
                    history.push("/")
                }
                
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
    }
    return(
        <div style={{height: "100vh", width:"100vw", display: "flex", justifyContent: "center", alignItems:"center",  background: "#fafcff"}}>
        <Card style={{ width: 450, borderRadius: "20px", background: "#fff", boxShadow: " 0px 8px 15px -2px rgba(0,0,0,0.1)" }}>
            <div style={{width: "100%", margin:"20px 0px 20px 0px",display: "flex", alignItems: "center", flexDirection: "column"}}>
                <div style={{width: "78%", display: "flex",alignItems:"center", justifyContent: "space-between"}}>
                   <Title level={2} style={{color: "#444", paddingTop:"10px"}}>Sign Up</Title>
                   <img src={logo} alt={"rip"} style={{width: "calc(48px * 0.55)", height:"calc(50px * 0.55)"}}></img>
                </div>
               <br></br>
               <Input size="default" autoComplete="off" id="name" placeholder="Enter name" onChange={handleForm} style={{borderRadius: "25px", height:"40px" , width: "80% ",margin: "25px 0px 10px 0px"}} prefix={<UserOutlined style={{marginRight: "10px"}}/>} />
               <Input size="default" autoComplete="off" id="email" placeholder="Enter email" onChange={handleForm} style={{borderRadius: "25px", height:"40px" , width: "80% ",margin: "10px 0px 10px 0px"}} prefix={<MailOutlined style={{marginRight: "10px"}}/>} />
               <Input.Password size="default"autoComplete="off" id="password" placeholder="Enter password" onChange={handleForm} style={{borderRadius: "25px", height:"40px" ,width: "80% ",margin: "10px 0px 10px 0px"}} prefix={<LockOutlined style={{marginRight: "10px"}}/>} />
               <Input.Password size="default"autoComplete="off" id="vpassword" placeholder="Verify password" onChange={handleForm} style={{borderRadius: "25px", height:"40px" ,width: "80% ",margin: "10px 0px 25px 0px"}} prefix={<LockOutlined style={{marginRight: "10px"}}/>} />

               {errors.length > 0 ? 
                   <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center"}}>
                       <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> {errors[0].msg} </Text>
                   </div>
                :
                   <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center", visibility: "hidden"}}>
                       <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> Error </Text>
                   </div>
               }
               <Button loading={loading} type="primary" block onClick={signup} style={{borderRadius: "25px",height:"40px" , width: "80% ",margin: "10px 0px 15px 0px"}}>Signup</Button>
               <Text style={{margin: "0px 0px 10px 0px"}}>Already have an HSE key account? <Link to={`/login${redirect ? `?redirect=${redirect}`  : ""}`}>Login</Link></Text>
            </div>
        </Card>
   </div>
    )
}


export default Signup