import React, { useRef } from 'react'
import styles from './FileUploader.module.css'

function FileUploader({ onFileChange }) {
  const fileInputRef = useRef()

  const handleButtonClick = e => {
    fileInputRef.current.click()
  }

  const handleChange = async event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        onFileChange({ data: e.target.result, name: file.name })
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <div className={styles.fileUploader}>
      <p>Selecciona un Informe Estadístico HSG para visualizarlo</p>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf'
        onChange={handleChange}
      />
      <button onClick={handleButtonClick}>Cargar PDF</button>
    </div>
  )
}

export default FileUploader
