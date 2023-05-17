import React, { useState, useEffect } from 'react'
import FileUploader from './components/FileUploader/FileUploader'
import PDFRenderer from './components/PDFRenderer/PDFRenderer'
import LoadingBar from 'react-top-loading-bar'
import { animateScroll as scroll } from 'react-scroll'
import './styles.css'

function App() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = newFile => {
    setProgress(30)
    setFile(newFile)
  }

  const scrollToPercentage = percentage => {
    const pixelPosition =
      document.documentElement.scrollHeight * (percentage / 100)
    scroll.scrollTo(pixelPosition)
  }

  useEffect(() => {
    if (file) {
      setProgress(100) // Cuando el archivo se ha cargado, el progreso es 100%
      setTimeout(() => {
        setProgress(0) // Reseteamos la barra de progreso
        scrollToPercentage(100) // Desplazamos hacia la sección de la tabla y el gráfico
      }, 1000)
    }
  }, [file])

  return (
    <div className='app'>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className='video-background'>
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            width: '100%',
            left: '50%',
            top: '50%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: '-1',
          }}>
          <source
            src={process.env.PUBLIC_URL + '/maquina-laser-18533.mp4'}
            type='video/mp4'
          />
        </video>
        <div className='overlay'></div>
        <div className='title-background'>
          <h1 className='title'>Skb Laser Tracer</h1>
          <div className='underline'></div>
          <FileUploader onFileChange={handleFileChange} />
        </div>
      </div>
      {file && <PDFRenderer file={file} />}
    </div>
  )
}

export default App
