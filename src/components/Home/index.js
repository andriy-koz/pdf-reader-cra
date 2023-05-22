// Home.js
import React from 'react';
import FileUploader from '../FileUploader';
import styles from './Home.module.css';

const Home = ({ onFileChange }) => {
  return (
    <div className={styles['video-background']}>
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
      <div className={styles['overlay']}></div>
      <div className={styles['title-background']}>
        <h1 className={styles['title']}>HSG Laser Tracer</h1>
        <div className={styles['underline']}></div>
        <FileUploader onFileChange={onFileChange} />
      </div>
    </div>
  );
};

export default Home;
