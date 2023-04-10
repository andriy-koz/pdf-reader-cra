import React, { useRef } from 'react'
import styles from './FileUploader.module.css'

function FileUploader({ onFileChange }) {
  const fileInputRef = useRef()

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
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf'
        onChange={handleChange}
      />
    </div>
  )
}

export default FileUploader
