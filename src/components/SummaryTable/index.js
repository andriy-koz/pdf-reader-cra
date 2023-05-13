import styles from './SummaryTable.module.css'

function SummaryTable({ piecesSummary }) {
  return (
    <table className={styles.summaryTable}>
      <thead>
        <tr>
          <th>Pieza</th>
          <th>Cantidad de piezas</th>
          <th>Mov. de material (min) (s)</th>
          <th>Mov. de material (max) (s)</th>
          <th>Mov. de material (prom) (s)</th>
        </tr>
      </thead>
      <tbody>
        {piecesSummary.map((piece, index) => (
          <tr key={index}>
            <td>{piece.title}</td>
            <td>{piece.count}</td>
            <td>{piece.minMaterialMoveTime}</td>
            <td>{piece.maxMaterialMoveTime}</td>
            <td>{piece.avgMaterialMoveTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SummaryTable
