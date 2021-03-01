import React, { useEffect,useState}from 'react'
import { UserOutlined, CloseOutlined, CheckCircleTwoTone, LoadingOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import {Link} from 'react-router-dom'
import { Card, Typography, Input, Button} from 'antd';
import logo from '../img/hsekey.png'
import axios from 'axios'
const {Title, Text} = Typography


const Verify = ({history}) => {
    const [loading,setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error,setError] = useState(false)
    const [errors,setErrors] = useState([])

    const[formData, setFormData] = useState({email: ""})


    useEffect(() => {
        document.title = "HSE Key | Signup"
    }, [])

    const handleForm = e => {
        setFormData({...formData, [e.target.id]: e.target.value})
     }

    const sendEmail = async () => {
        if(!formData.email){
            setErrors([{msg: "Please enter a valid email"}])
        } else {
       
            try{
                setLoading(true)
                const res = await axios.put(`${process.env.REACT_APP_AUTH_API}/user/password/reset`, {email: formData.email})

                
                setLoading(false)                
                setSent(true)

            } catch(err){
                setLoading(false)
                setError(true)
            }
        }
    }
    return(
        <div style={{height: "100vh", width:"100vw", display: "flex", justifyContent: "center", alignItems:"center",  background: "#fafcff"}}>
        <Card style={{ width: 450, height: 350,borderRadius: "20px", background: "#fff", boxShadow: " 0px 8px 15px -2px rgba(0,0,0,0.1)" }}>
            <div style={{width: "100%",display: "flex", alignItems: "center", justifyContent: 'flex-start',flexDirection: "column"}}>
                <div style={{width: "78%", display: "flex",alignItems:"center", justifyContent: "space-between"}}>
                   <Title level={3} style={{color: "#444", paddingTop:"10px"}}>Forgot Password</Title>
                   <img onClick={() => setLoading(!loading)} src={logo} alt={"rip"} style={{width: "calc(48px * 0.55)", height:"calc(50px * 0.55)"}}></img>
                </div>
               <br></br>
               {!sent ? 
               <>
               <Input size="default" autoComplete="off" id="email" placeholder="Enter account email" onChange={handleForm} style={{borderRadius: "25px",height:"40px", width: "80% ",margin: "25px 0px 10px 0px", boxShadow: "0 0 0px 1000px white inset"}} prefix={<UserOutlined style={{marginRight: "10px"}}/>} />
               {errors.length > 0 ? 
                        <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center"}}>
                            <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> {errors[0].msg} </Text>
                        </div>
                     :
                        <div style={{margin: "0px 0px 0px 0px", display: "flex", alignItems: "center", visibility: "hidden"}}>
                            <CloseOutlined style={{fontSize:"16px",marginRight:"5px" , color: "red"}}/> <Text type="danger"> Error </Text>
                        </div>
                    }    
               <Button loading={loading} type="primary" block onClick={sendEmail} style={{borderRadius: "25px",height:"40px" , width: "80% ",margin: "15px 0px 15px 0px"}}>Send Password Reset</Button>
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
                        <div style={{display:'flex', alignItems: 'center', width: '32%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CheckCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#52c41a" />
                            <Text > Reset link sent </Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/`}>Back to Home</Link></Text>
                    </>
                    :
                    <>
                        <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CloseCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#ff4d4f" />
                            <Text> Server Error </Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/`}>Back to Home</Link></Text>
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