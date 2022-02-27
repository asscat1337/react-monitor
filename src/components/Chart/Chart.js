import React from "react";
import {Container} from "@mui/material";
import { Pie} from "react-chartjs-2";
import {Chart,ArcElement,Tooltip,Legend} from "chart.js";

const CustomChart = ({vaccine,notVaccine}) => {
    Chart.register(ArcElement,Tooltip,Legend)
    const percentageNotVaccined = (notVaccine/(vaccine+notVaccine) * 100).toFixed(1)
    const percentageVaccine = (vaccine/(vaccine+notVaccine) * 100).toFixed(1)
    const pieChartData = {
        labels: [`Вакцинирован ${percentageVaccine}%`, `Не вакцинирован ${percentageNotVaccined}%`],
        datasets: [{
            data: [vaccine, notVaccine],
            label: "Список вакцинированных",
            backgroundColor: ["#2FDE00", "#00A6B4", "#ff6600"],
            hoverBackgroundColor: ["#175000", "#003350", "#993d00"],
            borderWidth:1
        }],
    };
    return (
        <Container sx={{width:500,height:500}}>
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