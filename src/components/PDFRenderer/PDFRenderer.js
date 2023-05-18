import React, { useState, useEffect, useRef } from 'react'
import * as pdfjs from 'pdfjs-dist'
import { useLocation } from 'react-router-dom'
import styles from './PDFRenderer.module.css'
import SummaryTable from '../SummaryTable'
import {
  filterMachiningReport,
  summarizePieces,
  calculateMaterialMoveTime,
  prepareBarChartData,
} from '../../utils'
import BarChart from '../BarChart'
import { animateScroll } from 'react-scroll'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PDFRenderer() {
  const location = useLocation()
  const file = location?.state?.file || null

  const [machinedPieces, setMachinedPieces] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [piecesSummary, setPiecesSummary] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const summaryTableRef = useRef(null)

  useEffect(() => {
    async function loadPDF() {
      if (!file) return
      const pdf = await pdfjs.getDocument(file).promise
      const numPages = pdf.numPages
      const pieces = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const joinedText = content.items.map(item => item.str).join('')

        const filteredText = filterMachiningReport(joinedText)

        const lines = filteredText.split('\n')
        lines.forEach(line => {
          const parts = line.split(' - ')
          if (parts.length === 3) {
            const title = parts[0]?.trim() || ''
            const dateTime = parts[1]?.trim() || ''
            const totalTime =
              parts[2]?.replace('Tiempo total: ', '').trim() || ''

            if (title && dateTime && totalTime) {
              const [startDate, startTime] = dateTime.split(' ')
              const piece = {
                title: title,
                startDate: startDate?.trim() || '',
                startTime: startTime?.trim() || '',
                totalTime: totalTime,
              }

              pieces.push(piece)
            }
          }
        })
      }
      for (let i = 1; i < pieces.length; i++) {
        const prevPiece = pieces[i - 1]
        const currPiece = pieces[i]

        if (
          prevPiece.startDate &&
          prevPiece.startTime &&
          currPiece.startDate &&
          currPiece.startTime
        ) {
          const materialMoveTime = calculateMaterialMoveTime(
            prevPiece,
            currPiece
          )
          prevPiece.materialMoveTime = materialMoveTime
        } else {
          prevPiece.materialMoveTime = undefined
        }
      }

      setMachinedPieces(pieces)
      const summarizedPieces = summarizePieces(pieces)

      if (summarizedPieces.length > 0) {
        setPiecesSummary(summarizedPieces)
      }
    }

    loadPDF()
  }, [file])

  useEffect(() => {
    if (summaryTableRef.current && file) {
      animateScroll.scrollTo(summaryTableRef.current.offsetTop)
    }
  }, [file, summaryTableRef])

  function handleDateChange(event) {
    setSelectedDate(event.target.value)
  }

  const filteredMachinedPieces = machinedPieces.filter(piece =>
    selectedDate ? piece.startDate === selectedDate : true
  )

  const barChartData = prepareBarChartData(filteredMachinedPieces)

  const filteredSummary = summarizePieces(filteredMachinedPieces)

  return (
    <div className={styles.pdfRenderer}>
      <label htmlFor='dateSelector'>Seleccionar fecha: </label>
      <input
        type='date'
        id='dateSelector'
        value={selectedDate || ''}
        onChange={handleDateChange}
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
  )
}

export default PDFRenderer
