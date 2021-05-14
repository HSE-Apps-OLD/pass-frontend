import React, {useContext, useState} from 'react'

import DataContext from '../contexts/DataContext'
import AuthContext from '../auth/AuthContext'
import {dotStyle, statusColorAndDesc, decisionFilter} from '../Functions'

import {Card, Tooltip, Col, Row} from 'antd'



const PassCard = ({filters, tipText, setVisible}) => {

    const {auth, setAuth} = useContext(AuthContext)
    const {dataContext, setDataContext} = useContext(DataContext)

    const [cols, setCols] = useState(Math.floor(window.innerWidth/500))
    window.onresize = () => {setCols(Math.floor(window.innerWidth/500))}


    return (
        <>
            {dataContext.passes.filter(item => decisionFilter(auth, filters, item)).length != 0?
                <Row gutter={[16,16]} width={{width:"100% !important"}}>
                    {dataContext.passes.map( (pass, index) => 
                        <>
                            {decisionFilter(auth, filters, pass) &&
                                <Col span={24/cols}>
                                    <Tooltip title={tipText} color="white" placement="bottom">
                                        <Card 
                                            hoverable
                                            style={{
                                                borderColor:"#dfdfdf", borderRadius:"10px",
                                                textAlign:"start", fontSize:"16px"
                                            }}
                                            onClick={() => {setVisible(index)}}
                                        >   

                                            <div 
                                                style={{
                                                    marginBottom:"20px", display:"flex",
                                                    justifyContent:"space-between", textAlign:"start", alignItems:"center"
                                                }}
                                            >
                                                <div>Date: {pass.date}</div>
                                                <Tooltip
                                                    title={statusColorAndDesc(pass.status)[1]}
                                                    color="white" style={{border:"5px solid black"}}
                                                >
                                                    <div style={dotStyle(pass.status, 16)}></div>
                                                </Tooltip>
                                            </div>

                                            {auth.user.role == 'teacher' && 
                                                <div style={{marginBottom:"10px"}}>Student: {pass.student_name}</div>
                                            }

                                            <div>Teacher: {pass.teacher_name}</div>

                                        </Card>
                                    </Tooltip>
                                </Col>
                            }
                        </>
                    )}
                </Row>
            :
                <div style={{fontSize:"16px", display:"flex", justifyContent:"center", marginTop:"25px"}}>
                    No passes were found with these attributes.
                </div>
            }
        </>
    )
}


export default PassCard
