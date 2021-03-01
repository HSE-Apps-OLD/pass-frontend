import React, { useEffect,useState}from 'react'
import { CheckCircleTwoTone, LoadingOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import {Link, useParams} from 'react-router-dom'
import { Card, Typography } from 'antd';
import logo from '../img/hsekey.png'
import axios from 'axios'
const {Title, Text} = Typography

const Verify = ({history}) => {
    const [loading,setLoading] = useState(true)

    const [error,setError] = useState(false)


    const {token} = useParams('emailToken')

    useEffect(() => {
        document.title = "HSE Key | Signup"
        verify()
    }, [])


    const verify = async () => {
       
            try{
                
                const res = await axios.post(`${process.env.REACT_APP_AUTH_API}/user/verify/`, {token})

                
                setLoading(false)                

            } catch(err){
                setLoading(false)
                setError(true)
            }
    }
    return(
        <div style={{height: "100vh", width:"100vw", display: "flex", justifyContent: "center", alignItems:"center",  background: "#fafcff"}}>
        <Card style={{ width: 450, height: 350,borderRadius: "20px", background: "#fff", boxShadow: " 0px 8px 15px -2px rgba(0,0,0,0.1)" }}>
            <div style={{width: "100%",display: "flex", alignItems: "center", justifyContent: 'flex-start',flexDirection: "column"}}>
                <div style={{width: "78%", display: "flex",alignItems:"center", justifyContent: "space-between"}}>
                   <Title level={3} style={{color: "#444", paddingTop:"10px"}}>HSE Key</Title>
                   <img onClick={() => setLoading(!loading)} src={logo} alt={"rip"} style={{width: "calc(48px * 0.55)", height:"calc(50px * 0.55)"}}></img>
                </div>
               <br></br>
               {loading ? 
                <>
                    <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'center', marginTop: '60px'}}>
                        <LoadingOutlined style={{fontSize: '35px', color: "#1890ff"}}></LoadingOutlined>                            
                    </div>

                </>
               : 
                !error ?
                    <>
                        <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CheckCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#52c41a" />
                            <Text > Email Verified</Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/`}>Back to Home</Link></Text>
                    </>
                    :
                    <>
                        <div style={{display:'flex', alignItems: 'center', width: '30%', justifyContent:'space-between', marginTop: '60px'}}>
                            <CloseCircleTwoTone style={{fontSize: '20px'}} twoToneColor="#ff4d4f" />
                            <Text> Link Expired </Text>
                        </div>
                        <Text style={{margin: "125px 0px 10px 0px"}}><Link to={`/`}>Back to Home</Link></Text>
                    </>
               }

            </div>
        </Card>
   </div>
    )
}


export default Verify