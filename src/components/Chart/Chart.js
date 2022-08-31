import React from "react";
import {Button, Container} from "@mui/material";
import { Pie} from "react-chartjs-2";
import {Chart,ArcElement,Tooltip,Legend} from "chart.js";
import {useDispatch} from "react-redux";
import {actionGetAnalytic, actionGetAnalyticMonth} from "../../store/actions/actionAnalytic";
import {transformIsNaN} from "../../helpers/transformIsNaN";

const CustomChart = ({vaccine,notVaccine,sick}) => {
    const dispatch = useDispatch()
    Chart.register(ArcElement,Tooltip,Legend)
    const percentageNotVaccined = (notVaccine/(vaccine+notVaccine+sick) * 100)
    const percentageVaccine = (vaccine/(vaccine+notVaccine+sick) * 100)
    const percentageSick = (sick/(vaccine+notVaccine+sick) * 100)
    const pieChartData = {
        labels: [`Вакцинирован ${transformIsNaN(percentageVaccine)}%`,
            `Не вакцинирован ${transformIsNaN(percentageNotVaccined)}%`,
            `Переболели ${transformIsNaN(percentageSick)}%`],
        datasets: [{
            data: [vaccine, notVaccine,sick],
            label: "Список вакцинированных",
            backgroundColor: ["#2FDE00", "#00A6B4", "#ff6600","faf0e6"],
            hoverBackgroundColor: ["#175000", "#003350", "#993d00",],
            borderWidth:1
        }],
    };

    const onChangeMonth=(month)=>{
        dispatch(actionGetAnalyticMonth(month))
    }

    const getAll=()=>{
        dispatch(actionGetAnalytic())
    }

    return (
        <Container sx={{width:500,height:500}}>
            <Button
                onClick={getAll}
            >
                Общий результат
            </Button>
            <Button onClick={()=>onChangeMonth(6)}>
                6 месяцев
            </Button>
            <Button onClick={()=>onChangeMonth(12)}>
                12 месяцев
            </Button>
            <Pie
                data={pieChartData}
                options={{
                    plugins: {
                        responsive:false,
                        legend: {
                            position: 'top',
                            display:true
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    const dataset = data.datasets[tooltipItem.datasetIndex];
                                    const currentValue = dataset.data[tooltipItem.index];
                                    let total = 0;
                                    for (let i = 0; i < data.datasets.length; i++) {
                                        total += data.datasets[i].data[tooltipItem.index];
                                    }
                                    const percentage = (currentValue / total * 100).toFixed(0);
                                    return `${currentValue} (${percentage}%)`;
                                },
                                title: function(tooltipItem, data) {
                                    return data.labels[tooltipItem[0].index];
                                }
                            }
                        }
                    }
                }}
                height="50%"
            />
        </Container>
    );
};
export default CustomChart;