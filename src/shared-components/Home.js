import React, {useState, useEffect, useContext} from 'react'
import { Card } from 'antd';
import { UserOutlined } from "@ant-design/icons"

import {Link} from 'react-router-dom';

import AuthContext from '../auth/AuthContext.js'

import Loading from './Loading';


const Home = () => {
    
    const {auth, setAuth} = useContext(AuthContext)

    return (
        <div id="body" style={{height:"120vh", display:"flex", justifyContent:"center"}}>
            
            <Link to='/login'>
                <Card style={{width:"350px", height:"120px", borderRadius:"60px"}} hoverable>
                    <div style={{display:"flex", justifyContent:"space-around", alignItems:"center", width:"300px"}}>
                        <UserOutlined style={{fontSize:"60px"}}/>
                        <div style={{width:"2px", height:"70px", background:"lightgray"}}></div>
                        <div style={{fontSize:"22px", width:"150px"}}>Log in to use application.</div>
                    </div>
                </Card>
            </Link>
            
        </div>
    )
}

export default Home
