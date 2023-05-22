import React, { useState, useRef, useMemo } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { useLocation } from 'react-router-dom';
import { summarizePieces, prepareBarChartData } from '../../utils';
import usePDFProcessing from '../../hooks/usePDFProcessing';
import BarChart from '../BarChart';
import SummaryTable from '../SummaryTable';
import DateSelector from '../DateSelector';
import styles from './PDFRenderer.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PDFRenderer() {
  const location = useLocation();
  const file = location?.state?.file || null;

  const { machinedPieces } = usePDFProcessing(file);

  const [selectedDate, setSelectedDate] = useState('');
  const summaryTableRef = useRef(null);

  function handleDateChange(event) {
    setSelectedDate(event.target.value);
  }

  const filteredMachinedPieces = useMemo(() => {
    return machinedPieces.filter(piece =>
      selectedDate ? piece.startDate === selectedDate : true
    );
  }, [machinedPieces, selectedDate]);

  const barChartData = useMemo(() => {
    return prepareBarChartData(filteredMachinedPieces);
  }, [filteredMachinedPieces]);

  const filteredSummary = useMemo(() => {
    return summarizePieces(filteredMachinedPieces);
  }, [filteredMachinedPieces]);

  return (
    <div className={styles.pdfRenderer}>
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <h2 className={styles.piecesSummaryHeader}>Resumen:</h2>
      {filteredSummary.length > 0 ? (
        <SummaryTable piecesSummary={filteredSummary} ref={summaryTableRef} />
      ) : (
        <p>No hay datos de resumen disponibles para la fecha seleccionada.</p>
      )}
      <h2 className={styles.piecesListHeader}>Gráfico de barras:</h2>
      <BarChart data={barChartData} />
    </div>
  );
}

export default PDFRenderer;
