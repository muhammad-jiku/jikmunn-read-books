import PDFViewer from '@components/ebook/PDFViewer';
import ReaderSettingsPanel from '@components/ebook/ReaderSettingsPanel';
import {
  fetchEBook,
  fetchReadingProgress,
  selectEBook,
  selectEBookError,
  selectEBookLoading,
  selectReaderSettings,
  selectReadingProgress,
} from '@redux/features/ebookSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import type { RootState } from '@redux/store';
import { Bookmark, FileText, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ebook.css';
import styles from './EBookReader.module.css';

const EBookReader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useAppDispatch();

  const ebook = useAppSelector((state: RootState) => selectEBook(state, bookId!));
  const progress = useAppSelector((state: RootState) => selectReadingProgress(state, bookId!));
  const settings = useAppSelector((state: RootState) => selectReaderSettings(state));
  const loading = useAppSelector((state: RootState) => selectEBookLoading(state));
  const error = useAppSelector((state: RootState) => selectEBookError(state));

  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchEBook(bookId));
      dispatch(fetchReadingProgress(bookId));
    }
  }, [dispatch, bookId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <FileText className='w-16 h-16 text-gray-400 mb-4' />
        <h2 className='text-xl font-semibold mb-2'>Failed to load e-book</h2>
        <p className='text-gray-500'>{error || 'E-book not found'}</p>
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <div className='w-16 border-r border-border bg-background flex flex-col items-center py-4'>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-lg mb-4 ${
            showSettings ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
          }`}
          title='Reader Settings'
        >
          <Settings className='w-6 h-6' />
        </button>
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`p-3 rounded-lg ${
            showBookmarks ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
          }`}
          title='Bookmarks'
        >
          <Bookmark className='w-6 h-6' />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className='w-80 border-r border-border bg-background p-4 overflow-y-auto'>
          <ReaderSettingsPanel />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`${styles.ebookReader} ${styles.ebookContent}`}
        data-font-family={settings.fontFamily}
        data-font-size={settings.fontSize}
        data-line-height={settings.lineHeight}
        data-brightness={settings.brightness}
      >
        {ebook.format === 'PDF' ? (
          <PDFViewer url={ebook.fileUrl} bookId={bookId!} />
        ) : (
          // Add EPUB viewer component here when implemented
          <div className='flex items-center justify-center h-full'>
            <p>EPUB viewer coming soon...</p>
          </div>
        )}
      </div>

      {/* Reading Progress */}
      {progress && (
        <div className='absolute bottom-0 left-0 right-0 bg-background border-t border-border p-2'>
          <div className='flex justify-between items-center px-4'>
            <span className='text-sm'>
              Page {progress.currentPage} of {progress.totalPages}
            </span>
            <div className='w-64 h-1 bg-border rounded-full overflow-hidden'>
              <div
                className={`${styles.progressBar} ${styles.progressBarReading}`}
                data-progress={`${(progress.currentPage / progress.totalPages) * 100}`}
              />
            </div>
            <span className='text-sm'>
              {Math.round((progress.currentPage / progress.totalPages) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EBookReader;
