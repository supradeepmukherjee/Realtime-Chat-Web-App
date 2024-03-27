import { ArcElement, CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'

Chart.register(ArcElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

export const LineChart = ({ val = [] }) => {
    const data = {
        labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun',],
        datasets: [{
            data: val,
            label: '',
            fill: false,
            backgroundColor: 'rgba(175,91,191,.2)',
            borderColor: 'rgba(75,191,191,.8)'
        }]
    }

    return <Line
        data={data}
        options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false },
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { display: false },
                    beginAtZero: true
                }
            }
        }} />
}

export const DoughnutChart = () => {
    return (
        <>

        </>
    )
}