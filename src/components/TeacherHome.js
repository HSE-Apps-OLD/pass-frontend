import React from 'react'
import {Card} from 'antd'

const styling = {
    "fontSize": "200px",
    "textAlign": "center",
    "paddingBottom": "1000px",
    "paddingTop": "100px",
    "display": "flex",
    "alignItems": "center",
    "flexDirection": "column"
}

const recentPasses = [
    {
        name: "Timmy",
        time: "adventure time",
        teacher: "Alec's Dick",
        description: "this is a description of my life's failures"
    },
    {
        name: "Timmy",
        time: "adventure time",
        teacher: "Alec's Dick",
        description: "this is a description of my life's failures"
    },
    {
        name: "Timmy",
        time: "adventure time",
        teacher: "Alec's Dick",
        description: "this is a description of my life's failures"
    },
    {
        name: "Timmy",
        time: "adventure time",
        teacher: "Alec's Dick",
        description: "this is a description of my life's failures"
    }
]


const TeacherHome = () => {
    return (
        <div style={styling}>
            {recentPasses.map((person, index) => 
                <Card style={{width:"50%", borderRadius:"20px", margin:"20px 0", fontSize:"30px", fontWeight:"800"}} hoverable>
                    <div>Name: {person.name}</div>
                    <div>Teacher: {person.teacher}</div>
                </Card>
            )}
        </div>
    )
}

export default TeacherHome
