const Student = require("./models/student.js");

function checkForValidInfo(students_info)
{
    let valid_students = [];

    for (let i = 0; i < students_info.length; i++)
    {
        let student = students_info[i];

        if(student["First Name"].length == 0)
            console.log("Invalid First Name: " + student["First Name"]);

        else if(student["Last Name"].length == 0)
            console.log("Invalid Last Name: " + student["Last Name"]);

        else if(student["Grade"].replace(/\s/g, '').length == 0 || student["Grade"].replace(/\s/g, '').length > 2)
            console.log("Invalid Grade: " + student["Grade"]);

        else if(student["Mid-term exams"].match(/\d+/g) > 100 || student["Mid-term exams"].match(/\d+/g) < 0)
            console.log("Invalid Mid-term exams: " + student["Mid-term exams"]);

        else if(student["Final exam"].match(/\d+/g) > 100 || student["Final exam"].match(/\d+/g) < 0)
            console.log("Invalid Final exam: " + student["Final exam"]);

        else if(student["CW 1"].match(/\d+/g) > 100 || student["CW 1"].match(/\d+/g) < 0)
            console.log("Invalid CW 1: " + student["CW 1"]);

        else if(student["CW 2"].match(/\d+/g) > 100 || student["CW 2"].match(/\d+/g) < 0)
            console.log("Invalid CW 2: " + student["CW 2"]);

        else if(student["Total Points"] > 400 || student["Total Points"] < 0)
            console.log("Invalid Total Points: " + student["Total Points"]);

        else if(student["Student Average"].match(/\d+/g) > 100 || student["Student Average"].match(/\d+/g) < 0)
            console.log("Invalid Student Average: " + student["Student Average"]);

        else
            valid_students.push(student);

    }

    return valid_students;
}

var getStudentsInfo = function()
{   
    Student.clearStudents()
    .then(() =>
    {
        console.log("\n\================================");
        console.log("UPDATING STUDENTS IN DATABASE!\n");

        console.log("Geting info about students");
        let students_info = require("./grade-records.json");
        console.log("Info downloaded\n");

        console.log("Checking info about students");
        students_info = checkForValidInfo(students_info);
        console.log("Info checked\n");
        
        console.log("Inserting info inside DATABASE");
        for (let i = 0; i < students_info.length; i++)
        {
            let student = students_info[i];
            let new_student = new Student(student["First Name"], student["Last Name"], parseInt(student["Mid-term exams"]), parseInt(student["Final exam"]),
            parseInt(student["CW 1"]), parseInt(student["CW 2"]), parseInt(student["Total Points"]), parseFloat(student["Student Average"]), student["Grade"].replace(/\s/g, ''));
            Student.insertStudent(new_student);
        }
        console.log("Info inserted\n");

        console.log("Students inserted: " + students_info.length);
    });
    
}

module.exports.getStudentsInfo = getStudentsInfo;