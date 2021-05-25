import * as ss from "https://unpkg.com/simple-statistics@7.1.0/index.js?module"

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

function loadFirstChart()
{
    fetch("/counted_grades")
    .then((response) => {
        return response.json();
    })
    .then(counted_grades =>
    {
        var ctx1 = document.getElementById('myChart1').getContext('2d');
        
        let counter = { F: 0, D: 0, C: 0, B: 0, A: 0 };

        for (let counter_key in counter) if (counter.hasOwnProperty(counter_key))
        {
            for (let counted_key in counted_grades) if (counted_grades.hasOwnProperty(counted_key))
            {
                if(counted_key.includes(counter_key))
                    counter[counter_key] += counted_grades[counted_key];
            }
        }

        var config = {
			type: 'pie',
			data: {
				datasets: [{
					data: [
						counter.F,
						counter.D,
						counter.C,
						counter.B,
						counter.A,
					],
					backgroundColor: [
						window.chartColors.red,
						window.chartColors.orange,
						window.chartColors.yellow,
						window.chartColors.green,
						window.chartColors.blue,
					],
					label: 'Dataset 1'
				}],
				labels: [
					'Below D- (F)',
					'From D- to D+',
					'From C- to C+',
					'From B- to B+',
					'From A- to A+'
				]
			},
			options: {
                title: {
                    display: true,
                    text: 'Students Grades'
                },
				responsive: true
			}
        };
        
        Chart.defaults.global.defaultFontSize = 15;

        new Chart(ctx1, config);
    });
}

function loadSecondChart()
{
    fetch("/info_arrays")
    .then((response) => {
        return response.json();
    })
    .then(info_arrays =>
    {
        var ctx1 = document.getElementById('myChart2').getContext('2d');
        
        let min = ss.min(info_arrays.total_points);
        let max = ss.max(info_arrays.total_points);

        let lower_boundary = Math.trunc(min / 10) * 10;
        let upper_boundary = Math.trunc(max / 10) * 10;

        let counter = {};
        let total_points = info_arrays.total_points;
        for(let i = lower_boundary; i <= upper_boundary; i += 10)
        {
            for(let j = 0; j < total_points.length; j++)
            {
                let value = total_points[j];
                if(value >= i && value < i + 10)
                {
                    let key = i.toString() + '-' + (i + 9).toString();
                    if(counter.hasOwnProperty(key))
                        counter[key] += 1;
                    else 
                        counter[key] = 1;
                }
            }
        }

        var config = {
			type: 'line',
			data: {
				labels: Object.keys(counter),
				datasets: [{
					label: 'Count Of Students With Particular Number Of Total Points',
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgb(250, 12, 63)',
					data: Object.values(counter),
					fill: true,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Students Total Points'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Range'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Count'
						}
					}]
				}
			}
        };
        
        Chart.defaults.global.defaultFontSize = 15;

        new Chart(ctx1, config);
    });
}

function loadThirdChart()
{
    fetch("/info_arrays")
    .then((response) => {
        return response.json();
    })
    .then(info_arrays =>
    {
        var ctx1 = document.getElementById('myChart3').getContext('2d');

        let counter = {mid_term_exam: {"1-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0},
            final_term_exam: {"1-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0},
            cw1: {"1-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0},
            cw2: {"1-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}};
        for(let i = 0; i < 100; i += 20)
        {
            for(let key in info_arrays) if(counter.hasOwnProperty(key))
            {
                let array = info_arrays[key];
                for(let j = 0; j < array.length; j++)
                {
                    let value = array[j];
                    if(value >= i + 1 && value <= i + 20)
                    {
                        let sub_key = (i + 1).toString() + '-' + (i + 20).toString();
                        if(counter[key].hasOwnProperty(sub_key))
                            counter[key][sub_key] += 1;
                        else 
                            counter[key][sub_key] = 1;
                    }
                }
            }
        }
        
        let data = {
            labels: ["1-20", "21-40", "41-60", "61-80", "81-100",],
            datasets: [
            {
                label: 'Mid-term exams(0-100)',
                data: Object.values(counter.mid_term_exam),
                backgroundColor: window.chartColors.red,
                borderColor: 'rgb(153, 0, 0)',
                borderWidth: 1
            },
            {
                label: 'Final exam(0-100)',
                data: Object.values(counter.final_term_exam),
                backgroundColor: window.chartColors.green,
                borderColor: 'rgb(0, 153, 0)',
                borderWidth: 1
            },
            {
                label: 'CW 1(0-100)',
                data: Object.values(counter.cw1),
                backgroundColor: window.chartColors.purple,
                borderColor: 'rgb(102, 0, 204)',
                borderWidth: 1
            },
            {
                label: 'CW 2(0-100)',
                data: Object.values(counter.cw2),
                backgroundColor: window.chartColors.blue,
                borderColor: 'rgb(0, 76, 153)',
                borderWidth: 1
            }]
        };
        let options = {
            responsive: true,
            title: {
                display: true,
                text: 'Exams And Course Works'
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Ranges'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Count'
                    }
                }]
            }
        };

        new Chart(ctx1, {
            type: 'bar',
            data: data,
            options, options
        });
    });
}

function loadFourthChart()
{
    fetch("/info_arrays")
    .then((response) => {
        return response.json();
    })
    .then(info_arrays =>
    {
        let dots = [];

        console.log(info_arrays.mid_term_exam);
        console.log(info_arrays.cw2);
        let linearReg = ss.linearRegression([info_arrays.mid_term_exam, info_arrays.cw2]);
        console.log(linearReg);

        for (let x = 0; x <= 50; x += 5)
        {
            dots.push( linearReg.m * x + linearReg.b );
        }

        var scatterChartData = {
            labels: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
			datasets: [{
				label: 'Linear regression',
                backgroundColor: 'rgba(255, 153, 153, 0.2)',
                borderColor: 'rgb(255, 102, 102)',
                borderWidth: 1,
				data: dots
			}]
		};

        var ctx = document.getElementById('myChart4').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: scatterChartData,
            options: {
                title: {
                    display: true,
                    text: 'Mid-term exams - CW 2'
                },
            }
        });
    });
}

function loadCircles()
{
    fetch("/info_arrays")
    .then((response) => {
        return response.json();
    })
    .then(info_arrays =>
    {
        var circle1 = document.getElementById('circle1');
        circle1.innerHTML = "Corelation<br>Mid-term exams : CW 1<br>" + (ss.sampleCorrelation(info_arrays.mid_term_exam, info_arrays.cw1)*100).toFixed(2)
        var circle2 = document.getElementById('circle2');
        circle2.innerHTML = "Corelation<br>Final exam : CW 2<br>" + (ss.sampleCorrelation(info_arrays.final_term_exam, info_arrays.cw2)*100).toFixed(2)
    });
}

function loadCharts()
{
    loadFirstChart();
    loadSecondChart();
    loadThirdChart();
    loadFourthChart();
    loadCircles();
}

window.addEventListener('load', async (le) => loadCharts());