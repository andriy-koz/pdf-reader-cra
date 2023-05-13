import { Bar } from 'react-chartjs-2' // Asegúrate de haber importado Bar de 'react-chartjs-2'

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
            x: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Piezas',
              },
              stacked: true, // Agregado para apilar las barras
            },
            y: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Tiempo (s)',
              },
              ticks: {
                beginAtZero: true,
                stepSize: 60, // Ajusta el paso del eje Y según sea necesario
              },
              stacked: true, // Agregado para apilar las barras
            },
          },
        }}
      />
    </div>
  )
}

export default BarChart
