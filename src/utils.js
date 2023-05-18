export function filterMachiningReport(text) {
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

export function summarizePieces(pieces) {
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
    avgMaterialMoveTime: (piece.sumMaterialMoveTime / piece.count).toFixed(3),
  }))

  return piecesSummary
}

export function calculateMaterialMoveTime(prevPiece, currPiece) {
  if (prevPiece.startDate !== currPiece.startDate) {
    return '0.000'
  }

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

export function timeStringToSeconds(timeString) {
  if (!timeString) return 0

  const [hours, minutes, secondsAndMs] = timeString.split(':')

  if (!hours || !minutes || !secondsAndMs) return 0

  const [seconds, ms] = secondsAndMs.split('.')
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseFloat(ms, 10) / 1000
  )
}

export function prepareBarChartData(filteredMachinedPieces) {
  const dataByHour = {}

  filteredMachinedPieces.forEach(piece => {
    // Extraer la hora del tiempo de inicio
    const hour = piece.startTime.split(':')[0]
    const cutTimeInt = timeStringToSeconds(piece.totalTime)
    const moveTime = parseFloat(piece.materialMoveTime)

    if (!dataByHour[hour]) {
      dataByHour[hour] = {
        cutTime: cutTimeInt,
        materialMoveTime: moveTime < 300 ? moveTime : 0,
        exceededMoveTime: moveTime >= 300 ? moveTime : 0,
      }
    } else {
      dataByHour[hour].cutTime += cutTimeInt
      if (moveTime < 300) {
        dataByHour[hour].materialMoveTime += moveTime
      } else {
        dataByHour[hour].exceededMoveTime += moveTime
      }
    }
  })

  const labels = Object.keys(dataByHour).sort()
  const cutTimeData = labels.map(hour => dataByHour[hour].cutTime)
  const materialMoveTimeData = labels.map(
    hour => dataByHour[hour].materialMoveTime
  )
  const exceededMoveTimeData = labels.map(
    hour => dataByHour[hour].exceededMoveTime
  )

  const preparedData = {
    labels: labels,
    datasets: [
      {
        label: 'Tiempo de corte (s)',
        data: cutTimeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'Stack 0',
      },
      {
        label: 'Tiempo de movimiento de material (s)',
        data: materialMoveTimeData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        stack: 'Stack 0',
      },
      {
        label: 'Movimientos de material superiores a 300s',
        data: exceededMoveTimeData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Puedes cambiar esto al color que prefieras
        stack: 'Stack 0',
      },
    ],
  }

  return preparedData
}
