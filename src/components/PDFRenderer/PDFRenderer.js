import React, { useState, useEffect } from 'react'
import * as pdfjs from 'pdfjs-dist'
import styles from './PDFRenderer.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PDFRenderer({ file }) {
  const [machinedPieces, setMachinedPieces] = useState([])

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
    }

    function filterMachiningReport(text) {
      const titleMatches = [
        ...text.matchAll(
          /(\d+、)(.*?)(\(Dibujo básico\)|\(Resultado de anidamiento\d*\))/g
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

    loadPDF()
  }, [file])

  return (
    <div className={styles.pdfRenderer}>
      {machinedPieces.map((piece, index) => (
        <div key={index} className={styles.piece}>
          {piece.title} - Fecha: {piece.startDate} - Hora: {piece.startTime} -
          Tiempo total: {piece.totalTime}
          {piece.materialMoveTime !== undefined && (
            <span>
              {' '}
              - Tiempo de movimiento de material: {piece.materialMoveTime} s
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default PDFRenderer
