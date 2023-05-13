import React, { useState, useEffect } from 'react'
import * as pdfjs from 'pdfjs-dist'
import styles from './PDFRenderer.module.css'
import SummaryTable from '../SummaryTable'
import {
  filterMachiningReport,
  summarizePieces,
  calculateMaterialMoveTime,
  prepareBarChartData,
} from '../../utils'
import BarChart from '../BarChart'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PDFRenderer({ file }) {
  const [machinedPieces, setMachinedPieces] = useState([])
  const [piecesSummary, setPiecesSummary] = useState([])
  const [selectedDate, setSelectedDate] = useState('')

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
      setPiecesSummary(summarizePieces(pieces))
    }

    loadPDF()
  }, [file])

  function handleDateChange(event) {
    setSelectedDate(event.target.value)
  }

  const filteredMachinedPieces = machinedPieces.filter(piece =>
    selectedDate ? piece.startDate === selectedDate : true
  )

  const barChartData = prepareBarChartData(filteredMachinedPieces)

  return (
    <div className={styles.pdfRenderer}>
      <h2 className={styles.piecesSummaryHeader}>Resumen:</h2>
      <SummaryTable piecesSummary={piecesSummary} />
      <label htmlFor='dateSelector'>Seleccionar fecha: </label>
      <input
        type='date'
        id='dateSelector'
        value={selectedDate || ''}
        onChange={handleDateChange}
      />
      <h2 className={styles.piecesListHeader}>Gráfico de barras:</h2>
      <BarChart data={barChartData} />
    </div>
  )
}

export default PDFRenderer
