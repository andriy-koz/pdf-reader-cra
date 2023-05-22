import React, { useState } from 'react';
import styles from './SummaryTable.module.css';

const SummaryTable = React.forwardRef(({ piecesSummary }, ref) => {
  const [piecesPerSheet, setPiecesPerSheet] = useState(
    piecesSummary.reduce((acc, curr) => {
      acc[curr.title] = 1;
      return acc;
    }, {})
  );

  function handlePiecesPerSheetChange(title, event) {
    const newPiecesPerSheet = { ...piecesPerSheet };
    newPiecesPerSheet[title] = parseInt(event.target.value);
    setPiecesPerSheet(newPiecesPerSheet);
  }

  function calculateAverageTime(piece) {
    const startTime = parseTime(piece.startTime);
    const endTime = parseTime(piece.endTime);
    const elapsedTime = (endTime - startTime) / 1000;
    const totalPieces = piece.count * piecesPerSheet[piece.title];
    return (elapsedTime / totalPieces).toFixed(3);
  }

  function parseTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 3600 * 1000 + minutes * 60 * 1000;
  }

  return (
    <div>
      <table className={styles.summaryTable} ref={ref}>
        <thead>
          <tr>
            <th>Pieza</th>
            <th>Cantidad de chapas</th>
            <th>Mejor tiempo de movimiento (s)</th>
            <th>Hora de inicio</th>
            <th>Hora de fin</th>
            <th>Piezas por chapa</th>
            <th>Promedio de tiempo por pieza (s)</th>
          </tr>
        </thead>
        <tbody>
          {piecesSummary.map((piece, index) => (
            <tr key={index}>
              <td>{piece.title}</td>
              <td>{piece.count}</td>
              <td>{piece.minMaterialMoveTime}</td>
              <td>{piece.startTime}</td>
              <td>{piece.endTime}</td>
              <td>
                <input
                  type='number'
                  value={piecesPerSheet[piece.title] || 1}
                  onChange={event =>
                    handlePiecesPerSheetChange(piece.title, event)
                  }
                />
              </td>
              <td>{calculateAverageTime(piece)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default SummaryTable;
