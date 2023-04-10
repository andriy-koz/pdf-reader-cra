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
      const numPages = Math.min(10, pdf.numPages)
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
        </div>
      ))}
    </div>
  )
}

export default PDFRenderer
