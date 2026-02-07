import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Bookshelf } from './components/Bookshelf';
import { NoteEditor } from './components/NoteEditor';
import { BookOpeningAnimation } from './components/BookOpeningAnimation';
import { Book } from './types';

export default function App() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Potions & Chemistry',
      color: '#8B4513',
      accentColor: '#D4AF37',
      notes: '',
    },
    {
      id: '2',
      title: 'Ancient Runes & History',
      color: '#4A0E4E',
      accentColor: '#9D50BB',
      notes: '',
    },
    {
      id: '3',
      title: 'Arithmancy & Mathematics',
      color: '#0F4C5C',
      accentColor: '#5FA8D3',
      notes: '',
    },
  ]);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openingBook, setOpeningBook] = useState<Book | null>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);

  const handleSelectBook = (book: Book) => {
    setOpeningBook(book);
  };

  const handleAnimationComplete = () => {
    setSelectedBook(openingBook);
    setOpeningBook(null);
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  const handleSaveNotes = (bookId: string, notes: string) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, notes } : book
    ));
  };

  const handleAddBook = (title: string, color: string, accentColor: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      color,
      accentColor,
      notes: '',
    };
    setBooks([...books, newBook]);
    setIsAddingBook(false);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
    }
  };

  const handleReorderBooks = (dragIndex: number, hoverIndex: number) => {
    const newBooks = [...books];
    const [draggedBook] = newBooks.splice(dragIndex, 1);
    newBooks.splice(hoverIndex, 0, draggedBook);
    setBooks(newBooks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        {openingBook ? (
          <BookOpeningAnimation
            book={openingBook}
            onAnimationComplete={handleAnimationComplete}
          />
        ) : !selectedBook ? (
          <Bookshelf
            books={books}
            onSelectBook={handleSelectBook}
            onAddBook={() => setIsAddingBook(true)}
            isAddingBook={isAddingBook}
            onCancelAddBook={() => setIsAddingBook(false)}
            onConfirmAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            onReorderBooks={handleReorderBooks}
          />
        ) : (
          <NoteEditor
            book={selectedBook}
            onClose={handleCloseBook}
            onSave={handleSaveNotes}
          />
        )}
      </div>
    </DndProvider>
  );
}