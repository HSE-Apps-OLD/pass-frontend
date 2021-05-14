export const dateString = (date) => {
    return date.toISOString().substring(0, date.toISOString().indexOf("T"))
}
export const getDates = (passArr) => {
    const dateArr = []
    for (var x of passArr) {
        if (dateArr.indexOf(x.date) == -1) {
            dateArr.push(x.date)
        }
    }
    dateArr.sort((a,b) => a.localeCompare(b))
    return dateArr
}



export const statusColorAndDesc = (status) => {
    if (status == 1) {return ['#52c41a', 'This pass has been both issued and used!']}
    else if (status == 0) {return ['#fadb14', 'This pass has been issued, but not used.']}
    else if (status == -1) {return ['#ff4d4f', 'This pass has not yet been issued.']}
    else {return ['lightgray', 'Unknown Status']}
}
export const dotStyle = (status, size) => { 
    return {height: size+"px", width: size+"px", borderRadius: size/2+"8px", backgroundColor: statusColorAndDesc(status)[0]}
}



export const decisionFilter = (auth, filters, pass) => {
    return auth.user.role=="teacher"? adminPassFilter(filters, pass) : studentPassFilter(pass, filters)
}
export const studentPassFilter = (pass, filters) => {
    return (
        pass._id.toLowerCase().indexOf(filters._id?.toLowerCase()) != -1 &&
        pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
        pass.date == dateString(filters.date) &&
        (pass.status == filters.status || filters.status == 2)
    )
}
export const adminPassFilter = (filters, pass) => {
    return pass.student_name.toLowerCase().indexOf(filters.student_name?.toLowerCase()) != -1 &&
    pass.teacher_name.toLowerCase().indexOf(filters.teacher_name?.toLowerCase()) != -1 &&
    pass.date == filters.date &&
    (pass.status == filters.status || filters.status == 2)
}



export const isFormFilled = (form) => {
    return (
        form.teacher_name && form.student_name 
        && form.date && form.description
    )
}
export const isRequestFilled = (form) => {
    return (
        form.teacher_name && form.date && form.description && form.for_time
    )
}



