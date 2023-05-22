import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styles from './BarChart.module.css';

Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 14;

function BarChart({ data }) {
  return (
    <div className={styles.bar}>
      <Bar
        data={data}
        options={{
          plugins: {
            legend: {
              labels: {
                color: '#CCC',
              },
            },
          },
          legend: {
            display: false,
          },
          scales: {
            x: {
              display: true,
              ticks: {
                color: '#CCC',
              },
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
                color: '#CCC',
                beginAtZero: true,
                stepSize: 60, // Ajusta el paso del eje Y según sea necesario
              },
              stacked: true, // Agregado para apilar las barras
            },
          },
        }}
      />
    </div>
  );
}

Chart.register(...registerables);

export default BarChart;
