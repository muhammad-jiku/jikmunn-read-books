import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { selectReadingProgress, updateReadingProgress } from '../../redux/features/ebookSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  bookId: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, bookId }) => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state: RootState) => selectReadingProgress(state, bookId));

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with saved progress
    if (progress?.currentPage) {
      setPageNumber(progress.currentPage);
    }
  }, [progress]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (!progress) {
      // Initialize reading progress if not exists
      dispatch(
        updateReadingProgress({
          bookId,
          progress: {
            currentPage: 1,
            totalPages: numPages,
            readingTime: 0,
            completed: false,
          },
        }),
      );
    }
  };

  const onDocumentLoadError = (error: Error) => {
    setError('Failed to load PDF. Please try again later.');
    console.error('PDF load error:', error);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      updateProgress(newPage);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      updateProgress(newPage);
    }
  };

  const updateProgress = (currentPage: number) => {
    dispatch(
      updateReadingProgress({
        bookId,
        progress: {
          currentPage,
          completed: numPages ? currentPage === numPages : false,
        },
      }),
    );
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(2.0, prevScale + 0.1));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
  };

  if (error) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Controls */}
      <div className='flex items-center justify-between p-4 border-b border-border bg-background'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className='p-2 rounded-full hover:bg-primary/10 disabled:opacity-50'
            title='Previous page'
            aria-label='Go to previous page'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>
          <span>
            Page {pageNumber} of {numPages || '...'}
          </span>
          <button
            onClick={goToNextPage}
            disabled={numPages === null || pageNumber >= numPages}
            className='p-2 rounded-full hover:bg-primary/10 disabled:opacity-50'
            title='Next page'
            aria-label='Go to next page'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={zoomOut}
            className='p-2 rounded-full hover:bg-primary/10'
            title='Zoom out'
            aria-label='Decrease zoom level'
          >
            <ZoomOut className='w-5 h-5' />
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className='p-2 rounded-full hover:bg-primary/10'
            title='Zoom in'
            aria-label='Increase zoom level'
          >
            <ZoomIn className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className='flex-1 overflow-auto'>
        <div className='flex justify-center p-4'>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className='flex items-center justify-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={
                <div className='flex items-center justify-center h-32'>
                  <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
                </div>
              }
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
