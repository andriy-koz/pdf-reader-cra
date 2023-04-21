import React, { useState, useEffect } from 'react'
import * as pdfjs from 'pdfjs-dist'
import styles from './PDFRenderer.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PDFRenderer({ file }) {
  const [machinedPieces, setMachinedPieces] = useState([])
  const [piecesSummary, setPiecesSummary] = useState([])

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
      // Función para calcular el tiempo de movimiento de material
      function calculateMaterialMoveTime(prevPiece, currPiece) {
        const prevStartTime = new Date(
          `${prevPiece.startDate}T${prevPiece.startTime}`
        )
        const currStartTime = new Date(
          `${currPiece.startDate}T${currPiece.startTime}`
        )
        const timeDiff = (prevStartTime - currStartTime) / 1000
        const prevTotalTime = timeStringToSeconds(prevPiece.totalTime)
        const materialMoveTime = timeDiff - prevTotalTime
        return materialMoveTime.toFixed(3)
      }
      /// Función para convertir el tiempo en formato HH:MM:SS.sss a segundos
      function timeStringToSeconds(timeString) {
        if (!timeString) return 0

        const [hours, minutes, secondsAndMs] = timeString.split(':')

        if (!hours || !minutes || !secondsAndMs) return 0

        const [seconds, ms] = secondsAndMs.split('.')
        return (
          parseInt(hours, 10) * 3600 +
          parseInt(minutes, 10) * 60 +
          parseInt(seconds, 10) +
          parseInt(ms, 10) / 1000
        )
      }

      setMachinedPieces(pieces)
      setPiecesSummary(summarizePieces(pieces))
    }

    function filterMachiningReport(text) {
      const titleMatches = [
        ...text.matchAll(
          /(\d+、)(.*?)(\(Dibujo básico\)|\(Resultado de anidamiento\d*\)|\(Resultado deanidamiento\d*\))/g
        ),
      ]

      const titles = titleMatches.map(match => match[2].trim())

      const startTimeMatches = [
        ...text.matchAll(
          /Tiempo de inicio：(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g
        ),
      ]
      const startTimes = startTimeMatches.map(match => match[1].trim())

      const totalTimeMatches = [
        ...text.matchAll(/Tiempo total：(\d{2}:\d{2}:\d{2}\.\d{3})/g),
      ]
      const totalTimes = totalTimeMatches.map(match => match[1].trim())

      const filteredText = titles
        .map(
          (title, index) =>
            `${title} - ${startTimes[index]} - Tiempo total: ${totalTimes[index]}`
        )
        .join('\n')

      return filteredText
    }

    function summarizePieces(pieces) {
      const summary = {}

      pieces.forEach(piece => {
        if (piece.materialMoveTime !== undefined) {
          if (!summary[piece.title]) {
            summary[piece.title] = {
              title: piece.title,
              minMaterialMoveTime: parseFloat(piece.materialMoveTime),
              maxMaterialMoveTime:
                piece.materialMoveTime < 120
                  ? parseFloat(piece.materialMoveTime)
                  : 0,
              sumMaterialMoveTime: parseFloat(piece.materialMoveTime),
              count: 1,
            }
          } else {
            const current = summary[piece.title]
            current.minMaterialMoveTime = Math.min(
              current.minMaterialMoveTime,
              parseFloat(piece.materialMoveTime)
            )

            // Solo actualizar maxMaterialMoveTime si el tiempo es menor a 120 segundos
            if (
              parseFloat(piece.materialMoveTime) < 180 &&
              parseFloat(piece.materialMoveTime) > current.maxMaterialMoveTime
            ) {
              current.maxMaterialMoveTime = parseFloat(piece.materialMoveTime)
            }

            current.sumMaterialMoveTime += parseFloat(piece.materialMoveTime)
            current.count++
          }
        }
      })

      const piecesSummary = Object.values(summary).map(piece => ({
        ...piece,
        avgMaterialMoveTime: (piece.sumMaterialMoveTime / piece.count).toFixed(
          3
        ),
      }))

      return piecesSummary
    }

    loadPDF()
  }, [file])

  return (
    <div className={styles.pdfRenderer}>
      <h2 className={styles.piecesSummaryHeader}>Resumen:</h2>
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
      <h2 className={styles.piecesListHeader}>Lista completa:</h2>
      <table className={styles.completeTable}>
        <thead>
          <tr>
            <th>Pieza</th>
            <th>Fecha de inicio</th>
            <th>Hora de inicio</th>
            <th>Tiempo de mecanizado (s)</th>
            <th>Tiempo de movimiento de material (s)</th>
          </tr>
        </thead>
        <tbody>
          {machinedPieces.map((piece, index) => (
            <tr key={index}>
              <td>{piece.title}</td>
              <td>{piece.startDate}</td>
              <td>{piece.startTime}</td>
              <td>{piece.totalTime}</td>
              <td>{piece.materialMoveTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PDFRenderer
