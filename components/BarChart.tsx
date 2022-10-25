import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

import { Bar } from 'react-chartjs-2'

export default function BarChart({ recievedData }: { recievedData: number }) {
  const data = {
    labels: ['Red'],
    datasets: [
      {
        label: 'Hip Y Coordinate',
        data: [recievedData],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div
      style={{
        width: 200,
        height: 500,
        border: '1px solid black',
        marginTop: 20,
        marginLeft: 20,
      }}
    >
      <Bar
        style={{
          position: 'absolute',
        }}
        data={data}
        width={100}
        height={250}
        options={{
          scales: {
            y: {
              min: 0,
              max: 400,
            },
            x: {},
          },
        }}
      />
    </div>
  )
}
