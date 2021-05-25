const mongoose = require('mongoose');

const StudentShema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mid_term_exam: { type: Number, required: true },
    final_term_exam: { type: Number, required: true },
    cw1: { type: Number, required: true },
    cw2: { type: Number, required: true },
    total_points: { type: Number, required: true },
    average: { type: Number, required: true },
    grade: { type: String, required: true },
});

const StudentModel = mongoose.model('student', StudentShema);

class Student
{
    constructor(first_name, last_name, mid_term_exam, final_term_exam, cw1, cw2, total_points, average, grade)
    {
        this.first_name = first_name;
        this.last_name = last_name;
        this.mid_term_exam = mid_term_exam;
        this.final_term_exam = final_term_exam;
        this.cw1 = cw1;
        this.cw2 = cw2;
        this.total_points = total_points;
        this.average = average;
        this.grade = grade;
    }

    static getStudentById(id)
    {
        return StudentModel.findById({ _id: id});
    }

    static getDataFromStudents(query)
    {
        return StudentModel.find({}).select(query);
    }
    
    static getAllStudents()
    {
        return StudentModel.find();
    }

    static insertStudent(student)
    {
        return new StudentModel(student).save();
    }

    static clearStudents()
    {
        return StudentModel.deleteMany({});
    }
}

module.exports = Student;