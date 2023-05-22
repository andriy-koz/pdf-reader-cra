import { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import {
  filterMachiningReport,
  summarizePieces,
  calculateMaterialMoveTime,
} from '../utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function usePDFProcessing(file) {
  const [machinedPieces, setMachinedPieces] = useState([]);
  const [piecesSummary, setPiecesSummary] = useState([]);

  useEffect(() => {
    async function loadPDF() {
      if (!file) return;
      const pdf = await pdfjs.getDocument(file).promise;
      const numPages = pdf.numPages;
      const pieces = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const joinedText = content.items.map(item => item.str).join('');

        const filteredText = filterMachiningReport(joinedText);

        const lines = filteredText.split('\n');
        lines.forEach(line => {
          const parts = line.split(' - ');
          if (parts.length === 3) {
            const title = parts[0]?.trim() || '';
            const dateTime = parts[1]?.trim() || '';
            const totalTime =
              parts[2]?.replace('Tiempo total: ', '').trim() || '';

            if (title && dateTime && totalTime) {
              const [startDate, startTime] = dateTime.split(' ');
              const piece = {
                title: title,
                startDate: startDate?.trim() || '',
                startTime: startTime?.trim() || '',
                totalTime: totalTime,
              };

              pieces.push(piece);
            }
          }
        });
      }
      for (let i = 1; i < pieces.length; i++) {
        const prevPiece = pieces[i - 1];
        const currPiece = pieces[i];
        if (
          prevPiece.startDate &&
          prevPiece.startTime &&
          currPiece.startDate &&
          currPiece.startTime
        ) {
          const materialMoveTime = calculateMaterialMoveTime(
            prevPiece,
            currPiece
          );
          prevPiece.materialMoveTime = materialMoveTime;
          prevPiece.endTime = currPiece.startTime;
        } else {
          prevPiece.materialMoveTime = undefined;
        }
      }
      setMachinedPieces(pieces);
      const summarizedPieces = summarizePieces(pieces);

      if (summarizedPieces.length > 0) {
        setPiecesSummary(summarizedPieces);
      }
    }

    loadPDF();
  }, [file]);

  return { machinedPieces, piecesSummary };
}
