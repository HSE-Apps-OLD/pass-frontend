import React, {useState} from 'react'
import {Card, Input, DatePicker} from 'antd'

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
        student_name: "Timmy",
        date: "adventure time",
        teacher_name: "Alec's Dick",
        description: "this is a description of my life's failures"
    }
]


const filterPasses = (passArr, filters) => {
    return passArr.filter(pass => 
        pass.student_name.toLowerCase().indexOf(filters.student_name?.toLowerCase()) != -1 &&
        pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
        pass.date.toLowerCase().indexOf(filters.date?.toLowerCase()) != -1
    )
}



const TeacherHome = () => {
    const [filters, setFilters] = useState({
        student_name: "",
        teacher_name: "",
        date: ""
    })

    return (
        <div style={styling}>
            
            <div style={{width:"70%", fontSize:"20px"}}>
                <DatePicker 
                    style={{width:"100%", margin:"5px 0"}} size="large"
                    addonBefore={<div>Student</div>}
                    onChange= {(e) => {
                        console.log(e)
                        setFilters({...filters, student_name: e});
                    }} />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Teacher</div>}
                    onChange = {(e) => {
                        console.log(e)
                        setFilters({...filters, teacher_name: e.target.value});
                    }}
                />
                <Input
                    style={{margin:"5px 0"}} size="large"
                    addonBefore={<div>Date</div>}
                    onChange = {(e) => {
                        console.log(e)
                        setFilters({...filters, date: e.target.value});
                    }}
                />
            </div>

            {filterPasses(recentPasses, filters).map((person, index) => 
                <Card 
                    style={{width:"70%", borderRadius:"10px", margin:"10px 0", fontSize:"20px", borderWidth:"5px", borderColor:"lightblue"}} 
                    hoverable
                >
                    <div>Date: {person.date}</div>
                    <div>Student: {person.student_name}</div>
                    <div>Teacher: {person.teacher_name}</div>
                    <div>Description: {person.description}</div>
                </Card>
            )}

        </div>
    )
}

export default TeacherHome
