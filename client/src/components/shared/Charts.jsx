import { ArcElement, CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { getLast7Days } from '../../lib/features'

Chart.register(ArcElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

const labels = getLast7Days()

export const LineChart = ({ val = [] }) => {
    const data = {
        labels,
        datasets: [{
            data: val,
            label: '',
            fill: true,
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

export const DoughnutChart = ({ val = [], labels = [] }) => {
    const data = {
        labels,
        datasets: [{
            data: val,
            label: 'Total Chats vs Group Chats',
            backgroundColor: ['rgba(175,91,191,.2)', 'red'],
            hoverBackgroundColor: ['yellow', 'green'],
            borderColor: ['rgba(75,191,191,.8)', 'orange'],
            offset: 30
        }]
    }
    return <Doughnut
        data={data}
        options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false },
            },
            cutout: 120
        }}
        style={{ zIndex: 10 }} />
}