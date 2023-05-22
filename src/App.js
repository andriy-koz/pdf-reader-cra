import { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import {
  // eslint-disable-next-line no-unused-vars
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Home from './components/Home';
import FileLoaded from './components/FileLoaded';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = newFile => {
    setProgress(30);
    setFile(newFile);
    navigate('/file-loaded', { state: { file: newFile } });
  };

  useEffect(() => {
    if (file) {
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    }
  }, [file]);

  return (
    <div className='app'>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route path='/' element={<Home onFileChange={handleFileChange} />} />
        <Route path='/file-loaded' element={<FileLoaded file={file} />} />
      </Routes>
    </div>
  );
}

export default App;
