// FileLoaded.js
import React from 'react';
import PDFRenderer from '../PDFRenderer/';

const FileLoaded = ({ file }) => {
  return file ? <PDFRenderer file={file} /> : null;
};

export default FileLoaded;
