import React, { useState } from 'react'
import FileUploader from './components/FileUploader/FileUploader'
import PDFRenderer from './components/PDFRenderer/PDFRenderer'
import './styles.css'

function App() {
  const [file, setFile] = useState(null)

  const handleFileChange = newFile => {
    setFile(newFile)
  }

  return (
    <div className='app'>
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
