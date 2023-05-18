import React from 'react'
import styles from './SummaryTable.module.css'

const SummaryTable = React.forwardRef(({ piecesSummary }, ref) => {
  return (
    <table className={styles.summaryTable} ref={ref}>
      <thead>
        <tr>
          <th>Pieza</th>
          <th>Cantidad de chapas</th>
          <th>Mejor tiempo de movimiento (s)</th>
        </tr>
      </thead>
      <tbody>
        {piecesSummary.map((piece, index) => (
          <tr key={index}>
            <td>{piece.title}</td>
            <td>{piece.count}</td>
            <td>{piece.minMaterialMoveTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})

export default SummaryTable
