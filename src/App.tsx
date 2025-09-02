import React, { useState, useEffect, useRef } from 'react';
import Calendar from './components/Calendar';
import DiaryModal from './components/DiaryModal';

export interface DiaryEntry {
  date: string;
  content: string;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() => {
    const savedDiaries = localStorage.getItem('diaries');
    return savedDiaries ? JSON.parse(savedDiaries) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  }, [diaries]);

  // メニューの外側をクリックしたら閉じる処理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleModalClose = () => {
    setSelectedDate(null);
  };

  const handleSaveDiary = (content: string) => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);
    const existingDiaryIndex = diaries.findIndex(d => d.date === dateStr);

    if (existingDiaryIndex > -1) {
      const updatedDiaries = [...diaries];
      updatedDiaries[existingDiaryIndex].content = content;
      setDiaries(updatedDiaries);
    } else {
      setDiaries([...diaries, { date: dateStr, content }]);
    }
    handleModalClose();
  };

  const handleDeleteDiary = () => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);
    setDiaries(diaries.filter(d => d.date !== dateStr));
    handleModalClose();
  };

  const handleDeleteAllDiaries = () => {
    setMenuOpen(false);
    if (window.confirm('本当にすべての日記を削除しますか？\nこの操作は元に戻せません。')) {
      setDiaries([]);
    }
  };

  const handleExport = () => {
    setMenuOpen(false);
    if (diaries.length === 0) {
      alert('書き出す日記がありません。');
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const sortedDiaries = [...diaries].sort((a, b) => a.date.localeCompare(b.date));
    let exportContent = '日記データ\n\n';
    sortedDiaries.forEach(diary => {
      exportContent += `【日付】: ${diary.date}\n`;
      exportContent += `【内容】:\n${diary.content}\n\n`;
      exportContent += '--------------------\n\n';
    });
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diary_${todayStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentDiary = selectedDate 
    ? diaries.find(d => d.date === formatDate(selectedDate)) 
    : undefined;

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
        <h1 className="fs-4 mb-0">日記アプリ</h1>
        <div className="position-relative" ref={menuRef}>
          <button className="btn btn-outline-secondary" onClick={() => setMenuOpen(!isMenuOpen)}>
            メニュー
          </button>
          {isMenuOpen && (
            <div className="card position-absolute" style={{ width: '220px', top: '100%', right: 0, zIndex: 10 }}>
              <ul className="list-group list-group-flush">
                <li className="list-group-item list-group-item-action" onClick={handleExport} style={{ cursor: 'pointer' }}>
                  日記をテキストで書き出す
                </li>
                <li className="list-group-item list-group-item-action text-danger" onClick={handleDeleteAllDiaries} style={{ cursor: 'pointer' }}>
                  全日記を削除
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main>
        <Calendar onDateClick={handleDateClick} diaries={diaries} />
      </main>

      {selectedDate && (
        <DiaryModal 
          date={selectedDate}
          content={currentDiary?.content || ''}
          onClose={handleModalClose}
          onSave={handleSaveDiary}
          onDelete={handleDeleteDiary}
        />
      )}

      <footer className="pt-3 mt-4 text-muted border-top">
        <p className="mb-0">&copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;