import React , {useState, useContext, useEffect} from 'react';
import Navbar from '../components/Navbar'
import SettingsNav from './SettingsNav'

import { Row, Col, Typography, PageHeader, Card, Menu, Button, Input, Switch, Divider, message, Tooltip} from 'antd';
import { MinusCircleTwoTone, CheckCircleTwoTone, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthContext from './AuthContext'
import axios from 'axios'
import AvatarUpload from './AvatarUpload';

const {Title , Text} = Typography


const Settings = ({history}) => {
  
    
    const {auth, setAuth} = useContext(AuthContext)
    const [activeKey, setActiveKey] = useState("info")
    const [form, setForm] = useState()
    const [errors,setErrors] = useState([])
    const [edited,setEdited] = useState(false)

    
    const logout = () => {
        setAuth({isAuth: false, fetched: true, loading: false})
        localStorage.removeItem("token")
        history.push("/")
    }

    useEffect(() => {
        if(auth.user){
            setForm({
                email: auth.user.email,
                phone: auth.user.phone || "",
                name: auth.user.name || "",
                class: auth.user.class || "",
                img: auth.user.profilePictureURL,
                earlyAdopter: auth.user.earlyAdopter || false
            })

        }
    }, [auth])

    const handleForm = e => {
        setEdited(true)
        setForm({...form, [e.target.id]: e.target.value})
     }



    const updateUser = async () => { 
        try{
            const body = JSON.stringify({name: form.name.trim(), img: form.img.trim(), 'class': form.class.toString().trim(), phone: form.phone.trim(), earlyAdopter: form.earlyAdopter})
            const res = await axios.put(`${process.env.REACT_APP_AUTH_API}/user?time=${new Date().getTime()}`, body, {
                headers:{ 
                      "Content-Type": "application/json"
                }
            })

            console.log(res.data)
            setAuth({...auth, user: {...auth.user, name: res.data.name, class:res.data.class, phone:res.data.phone, earlyAdopter: res.data.earlyAdopter}})
            console.log("here:")
            console.log(auth)
            setErrors([])
            setEdited(false)
            message.success('Account information updated', 5)


        } catch(err){
            if(err?.response?.data){
                setErrors(err.response.data.errors)
            } else {
                setErrors([{"msg": "Server error"}])

            }
            setTimeout(() => setErrors([]), 2500)
        }
    }
    

    return(
        <div className="App">
            <Navbar></Navbar>
            <div id="body" style={{height: "120vh", marginTop:"50px"}}>


                <PageHeader
                    className="site-page-header"
                    onBack={() => history.push('/')}
                    title={
                        <div>
                            <Title level={2} style={{marginBottom:"0px"}} >Settings</Title>
                        </div>
                    }
                />

                <div style={{margin:"20px 40px 0px 48px", display:"flex", justifyContent:"space-between"}}>
                    
                    <div style={{width: "20%", minWidth: "275px", marginBottom: "40px"}}>
                        <SettingsNav
                            onClick={(e) => {
                                setActiveKey(e.key)
                                if(e.key === 'logout'){
                                    logout()
                                }
                            }}
                        >
                            <Menu.Item key="info" style={activeKey === "info" && {color: "#1890ff"} }icon={<UserOutlined />}>My Account</Menu.Item>
                            <Menu.Item key="logout" danger style={activeKey && {color: "#ff4d4f"}}icon={<LogoutOutlined />}>Logout</Menu.Item>
                        </SettingsNav>
                    </div>

                    <div style={{width: "75%", marginLeft:"2.5%"}}>
                        <Card  style={{ borderRadius: "20px", marginBottom: "20px"}}>
                            {auth.user && form && 
                                <div>

                                    <div style={{width:"100%", display:"flex"}}>
                                        <AvatarUpload  
                                            avatar={form.img ? form.img : auth.user.profilePictureURL}
                                            changeHandeler={(info) => {
                                                if (info.file.status === 'done') {
                                                    setEdited(true)
                                                    setForm({...form, img: info.file.response})
                                                } 
                                        }}/>
                                        <div style={{display: "flex",paddingLeft: "20px", justifyContent: "space-evenly", width: "calc(100% - 100px)", flexDirection:"row"}}>

                                            <div style={{width: "45%"}}>
                                                <div style={{marginBottom: "15px"}}>
                                                    <div style={{marginBottom:"3px"}}>
                                                        <Text strong style={{fontSize: "10px"}}>NAME</Text>
                                                    </div>
                                                    <Input id="name" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Name" value={form.name}></Input>
                                                </div>
                                                <div style={{marginBottom: "15px"}}>
                                                    <div style={{marginBottom:"3px"}}>
                                                        <Text strong style={{fontSize: "10px"}}>EMAIL</Text>
                                                    </div>
                                                    <Input id="email" suffix={auth.user.verified ?   <Tooltip title="Verified"><CheckCircleTwoTone  twoToneColor="#52c41a" /></Tooltip>  :  <Tooltip title="Not Verified"><MinusCircleTwoTone twoToneColor="#ff4d4f" /></Tooltip> } disabled onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px", cursor: "pointer"}} placeholder="Email" value={form.email}></Input>
                                                </div>
                                            </div>

                                            <div  style={{width: "45%"}}>
                                                <div style={{marginBottom: "15px"}}>
                                                    <div style={{marginBottom:"3px"}}>
                                                        <Text strong style={{fontSize: "10px"}}>PHONE</Text>
                                                    </div>
                                                    <Input id="phone"  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={handleForm} style={{width: "100%", height: "40px", borderRadius: "5px"}} type="tel" placeholder="Phone" value={form.phone}></Input>
                                                </div>
                                                { auth.user.role === "student" &&
                                                <div>
                                                    <div style={{marginBottom:"3px"}}>
                                                        <Text strong style={{fontSize: "10px"}}>CLASS</Text>
                                                    </div>
                                                    <Input id="class" onChange={handleForm}  style={{width: "100%", height: "40px", borderRadius: "5px"}} placeholder="Graduating Class" value={form.class}></Input>
                                                </div>
                                                }
                                            </div> 

                                        </div>            
                                    </div>

                                    <div style={{width:"100%", display:"flex", marginTop: "20px"}}>
                                        <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                            <div style={{width: "95%"}}>

                                                <Divider orientation="left" plain>
                                                    Early Adopter Program
                                                </Divider>

                                                <div style={{display:"flex", justifyContent: "space-between"}}>
                                                    <div style={{width: "85%"}}>
                                                        <Text>Opt in to recieve features earlier and provide feedback to the HSE Apps team. </Text>
                                                    </div>
                                                    <Switch checked={form.earlyAdopter} onChange={() => {
                                                        setEdited(true)
                                                        setForm({...form, earlyAdopter: !form.earlyAdopter})
                                                    }}></Switch>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    <div style={{width:"100%", display:"flex", marginTop: "80px"}}>   
                                        <div style={{paddingLeft: "20px", marginLeft:"100px", width: "calc(100% - 100px)", display:"flex", justifyContent:"center"}}>
                                            <div style={{width: "95%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                                                { errors.length > 0 &&
                                                    <Text type="danger">{errors[0].msg}</Text>
                                                }
                                                {edited &&
                                                    <Button style={{marginLeft: "15px"}} onClick={updateUser} type='primary'>Save</Button>
                                                }                                
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            }
                        </Card>
                    </div>

                </div>

            </div>

            
        </div>
    )
}

export default Settings;