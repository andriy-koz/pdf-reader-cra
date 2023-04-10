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
      <FileUploader onFileChange={handleFileChange} />
      {file && <PDFRenderer file={file} />}
    </div>
  )
}

export default App
