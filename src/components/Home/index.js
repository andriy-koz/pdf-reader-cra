// Home.js
import React from 'react'
import FileUploader from '../FileUploader/FileUploader'

const Home = ({ onFileChange }) => {
  return (
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
        <h1 className='title'>HSG Laser Tracer</h1>
        <div className='underline'></div>
        <FileUploader onFileChange={onFileChange} />
      </div>
    </div>
  )
}

export default Home
