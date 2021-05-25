const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const child_process = require('child_process');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const simple_statistics = require("simple-statistics")

const app = express();

const config = require('./config');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const Student = require("./models/student.js");

const viewsDir = path.join(__dirname, 'views');
app.engine("mst", mustache(path.join(viewsDir, "partials")));
app.set('views', viewsDir);
app.set('view engine', 'mst');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(busboyBodyParser({ limit: '5mb' }));

app.use(express.static('public'));

// new middleware
app.use(cookieParser());
app.use(session({
	secret: config.SecretString,
	resave: false,
	saveUninitialized: true
}));

const PORT = config.ServerPort;
const databaseUrl = config.DatabaseUrl;
const connectOptions = { useNewUrlParser: true};

mongoose.connect(databaseUrl, connectOptions)
    .then(() => console.log(`Database connected: ${databaseUrl}`))
    .then(() => app.listen(PORT, function() { console.log('Server is ready'); }))
    .catch(err => console.log(`Start error ${err}`));

const dbUpdate = require('./update_db');

setInterval(dbUpdate.getStudentsInfo, 30000);

app.get('/export', function(req, res)
{
    console.log(__dirname)
    const pathToSave = path.join(__dirname, `./backup`);
    const command = `mongodump --host localhost --port 27017 --forceTableScan --db mydb --out ${pathToSave} `;
    child_process.exec(command);
    res.redirect('/?result=operation+successful');
});

app.get('/import', function(req, res)
{
    console.log(__dirname)
    const pathToRestore = path.join(__dirname, `./backup`);
    const command = `mongorestore ${pathToRestore} `;
    child_process.exec(command);
    res.redirect('/?result=operation+successful');
});

app.get('/', function(req, res)
{
    res.render('index', {});
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getCountedGrades(grades)
{
    let counter = {"F":0, "D-":0, "D":0, "D+":0, "C-":0, "C":0, "C+":0, "B-":0, "B":0, "B+":0, "A-":0, "A":0, "A+":0};
    for (let i = 0; i < grades.length; i++)
    {
        let grade = grades[i];
        if(counter.hasOwnProperty(grade))
            counter[grade]++;
        else 
            console.log("Invalid grade!");
    }

    return counter;
}

function getMedianGrade(grades)
{
    const GradesLetterEnum = {"F":1, "D-":2, "D":3, "D+":4, "C-":5, "C":6, "C+":7, "B-":8, "B":9, "B+":10, "A-":11, "A":12, "A+":13};

    let sum = 0;
    let counter = 0;
    for (let i = 0; i < grades.length; i++)
    {
        let grade = grades[i];
        if(GradesLetterEnum.hasOwnProperty(grade))
        {
            sum += GradesLetterEnum[grade];
            counter++;
        }
        else 
            console.log("Invalid grade!");
    }

    let average = Math.round(sum/counter)

    let result = getKeyByValue(GradesLetterEnum, average);

    return result;
}

function getInfoArrays(students)
{
    let students_info_arrays = {mid_term_exam: [], final_term_exam: [], cw1: [], cw2: [], total_points: [], average: [], grade: []}
    for (let i = 0; i < students.length; i++)
    {
        let student = students[i];
        for (let key in student) if (students_info_arrays.hasOwnProperty(key))
        {
            students_info_arrays[key].push(student[key]);
        }
    }

    return students_info_arrays;
}

function getMode(students_info_arrays)
{
    let counted_grades = getCountedGrades(students_info_arrays.grade);
    let arr = Object.values(counted_grades);
    let max = Math.max(...arr);
    let mode_grade = getKeyByValue(counted_grades, max);

    return { mid_term_exam: simple_statistics.mode(students_info_arrays.mid_term_exam).toFixed(2), final_term_exam: simple_statistics.mode(students_info_arrays.final_term_exam).toFixed(2), 
        cw1: simple_statistics.mode(students_info_arrays.cw1).toFixed(2), cw2: simple_statistics.mode(students_info_arrays.cw2).toFixed(2), 
        total_points: simple_statistics.mode(students_info_arrays.total_points).toFixed(2), average: simple_statistics.mode(students_info_arrays.average).toFixed(2),
        grade: mode_grade };
}

function getMedian(students_info_arrays)
{
    return { mid_term_exam: simple_statistics.median(students_info_arrays.mid_term_exam).toFixed(2), final_term_exam: simple_statistics.median(students_info_arrays.final_term_exam).toFixed(2), 
        cw1: simple_statistics.median(students_info_arrays.cw1).toFixed(2), cw2: simple_statistics.median(students_info_arrays.cw2).toFixed(2), 
        total_points: simple_statistics.median(students_info_arrays.total_points).toFixed(2), average: simple_statistics.median(students_info_arrays.average).toFixed(2),
        grade: getMedianGrade(students_info_arrays.grade) };
}

app.get('/students', function(req, res)
{
    Student.getDataFromStudents("-_id")
    .then(students =>
    {
        students.sort(function(a, b) {
            return ('' + a.first_name + " " + a.last_name).localeCompare(b.first_name + " " + b.last_name);
        });

        let students_info_arrays = getInfoArrays(students);

        let mode = getMode(students_info_arrays);
        let median = getMedian(students_info_arrays);

        let idx = 1;
        res.render('students', { students, mode, median, "index": function() {return idx++;} });
    })
    .catch(err => res.status(500).send(err.toString()));
});

app.get('/graphics', function(req, res)
{
    res.render('graphics');
});

app.get('/info_arrays', function(req, res)
{
    Student.getDataFromStudents("-_id")
    .then(students =>
    {
        students.sort(function(a, b) {
            return ('' + a.first_name + " " + a.last_name).localeCompare(b.first_name + " " + b.last_name);
        });

        let students_info_arrays = getInfoArrays(students);
        res.send(students_info_arrays);
    });
});

app.get('/counted_grades', function(req, res)
{
    Student.getDataFromStudents("-_id")
    .then(students =>
    {
        students.sort(function(a, b) {
            return ('' + a.first_name + " " + a.last_name).localeCompare(b.first_name + " " + b.last_name);
        });

        let students_info_arrays = getInfoArrays(students);

        let counted_grades = getCountedGrades(students_info_arrays.grade);
        res.send(counted_grades);
    });
});

app.use(function(req, res)
{
    res.render('404', {});
});