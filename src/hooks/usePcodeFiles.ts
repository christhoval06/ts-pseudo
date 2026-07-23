import { useState } from 'react';

import {
  createPcodeDownloadName,
  isPcodeFileName,
  parsePcodeFile,
  serializePcodeFile,
} from '../utils/pcodeFiles';

export function usePcodeFiles(code: string, loadProgram: (code: string) => void) {
  const [currentFileName, setCurrentFileName] = useState('programa.pcode');

  const handleSavePcode = () => {
    const fileName = createPcodeDownloadName(currentFileName);
    const blob = new Blob([serializePcodeFile(code)], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
    setCurrentFileName(fileName);
  };

  const handleOpenPcode = async (file: File) => {
    if (!isPcodeFileName(file.name)) {
      window.alert('Por favor selecciona un archivo .pcode');
      return;
    }

    loadProgram(parsePcodeFile(await file.text()));
    setCurrentFileName(file.name);
  };

  return { handleSavePcode, handleOpenPcode };
}
