import React from 'react';
import { FileSystemProvider } from '../context/FileSystemContext';
import '../index.css';

function MyApp({ Component, pageProps }) {
  return (
    <FileSystemProvider>
      <Component {...pageProps} />
    </FileSystemProvider>
  );
}

export default MyApp;
