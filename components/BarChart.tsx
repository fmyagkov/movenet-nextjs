import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import { min } from '@tensorflow/tfjs-core'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

export default function BarChart({ recievedData }: { recievedData: number }) {
  const maxY = 400 // This should match the max value in your options
  const squatThreshold = 275

  const data = {
    labels: ['Hip Y'],
    datasets: [
      {
        label: 'Hip Y Coordinate',
        data: [recievedData],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: maxY,
        min: 200,
        reverse: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 300,
            yMax: 300,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          },
          line2: {
            type: 'line',
            yMin: 250,
            yMax: 250,
            borderColor: 'rgb(0,0,128)',
            borderWidth: 2,
          },
          line3: {
            type: 'line',
            yMin: 350,
            yMax: 350,
            borderColor: 'rgb(0,128,0)',
            borderWidth: 2,
          },
          label2: {
            type: 'label',
            yValue: 245,
            content: 'Start',
          },
          label3: {
            type: 'label',
            yValue: 345,
            content: 'End',
          },
        },
      },
    },
  }

  return (
    <div style={{ width: '200px', height: '400px', border: '1px solid black' }}>
      {/* @ts-ignore */}
      <Bar data={data} options={options} />
    </div>
  )
}
