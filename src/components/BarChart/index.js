import { Bar } from 'react-chartjs-2'

function BarChart({ data }) {
  return (
    <div>
      <Bar
        data={data}
        options={{
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Piezas',
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Tiempo (s)',
                },
                ticks: {
                  beginAtZero: true,
                  stepSize: 60, // Ajusta el paso del eje Y según sea necesario
                },
              },
            ],
          },
        }}
      />
    </div>
  )
}

export default BarChart
