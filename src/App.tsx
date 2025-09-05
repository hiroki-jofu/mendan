import React, { useState, useEffect, useRef, useMemo } from 'react';
import Calendar from './components/Calendar';
import InterviewModal from './components/InterviewModal';
import './App.css'; // 作成したCSSをインポート

// データ構造の定義
export interface InterviewRecord {
  id: string; // 各記録の一意なID
  studentName: string;
  studentGrade: string;
  studentDepartment: string;
  category: string;
  content: string;
}

export interface InterviewData {
  date: string;
  records: InterviewRecord[];
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [interviews, setInterviews] = useState<InterviewData[]>(() => {
    const saved = localStorage.getItem('interviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

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

  // 保存処理（新しいデータ構造に対応）
  const handleSave = (records: InterviewRecord[]) => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);
    const index = interviews.findIndex(i => i.date === dateStr);

    // recordsが空の場合は、その日付のデータを削除
    if (records.length === 0) {
      setInterviews(interviews.filter(i => i.date !== dateStr));
    } else {
      const newInterviewData = { date: dateStr, records };
      if (index > -1) {
        const updated = [...interviews];
        updated[index] = newInterviewData;
        setInterviews(updated);
      } else {
        setInterviews([...interviews, newInterviewData]);
      }
    }
    handleModalClose();
  };

  // 日付単位での削除処理
  const handleDeleteDate = () => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);
    setInterviews(interviews.filter(i => i.date !== dateStr));
    handleModalClose();
  };

  const handleDeleteAll = () => {
    setMenuOpen(false);
    if (window.confirm('本当にすべての記録を削除しますか？\nこの操作は元に戻せません。')) {
      setInterviews([]);
    }
  };

  // CSV形式での書き出し処理
  const handleExportCsv = () => {
    setMenuOpen(false);
    if (interviews.length === 0) {
      alert('書き出す記録がありません。');
      return;
    }

    const escapeCsvCell = (cell: string) => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    };

    const headers = ['面談日', '氏名', '学年', '学生所属', '面談カテゴリー', '本文'];
    const rows = interviews.flatMap(interview => {
      if (!interview || !Array.isArray(interview.records)) {
        return []; // 不正なデータはスキップ
      }
      return interview.records.map(record => [
        interview.date,
        record.studentName,
        record.studentGrade,
        record.studentDepartment,
        record.category,
        record.content
      ].map(escapeCsvCell).join(','));
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    // BOMを先頭に付与してExcelでの文字化けを防ぐ
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mendan_kiroku_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredInterviews = useMemo(() => {
    if (!searchQuery) return interviews;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return interviews.map(interview => {
      // interviewやinterview.recordsが存在しない、または配列でない場合を考慮
      if (!interview || !Array.isArray(interview.records)) {
        return { ...interview, records: [] };
      }
      const filteredRecords = interview.records.filter(record => 
        (record.studentName && record.studentName.toLowerCase().includes(lowerCaseQuery)) ||
        (record.studentGrade && record.studentGrade.toLowerCase().includes(lowerCaseQuery)) ||
        (record.studentDepartment && record.studentDepartment.toLowerCase().includes(lowerCaseQuery)) ||
        (record.category && record.category.toLowerCase().includes(lowerCaseQuery)) ||
        (record.content && record.content.toLowerCase().includes(lowerCaseQuery))
      );
      return { ...interview, records: filteredRecords };
    }).filter(interview => interview.records.length > 0);
  }, [searchQuery, interviews]);

  const currentInterviewData = selectedDate 
    ? interviews.find(i => i.date === formatDate(selectedDate)) 
    : undefined;

  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 app-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="fs-4 mb-0 app-title">面談記録アプリ</h1>
          <div className="position-relative" ref={menuRef}>
            <button className="btn btn-outline-secondary" onClick={() => setMenuOpen(!isMenuOpen)}>
              メニュー
            </button>
            {isMenuOpen && (
              <div className="card position-absolute" style={{ width: '250px', top: '100%', right: 0, zIndex: 10 }}>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item list-group-item-action" onClick={handleExportCsv} style={{ cursor: 'pointer' }}>
                    記録をExcel形式で書き出す
                  </li>
                  <li className="list-group-item list-group-item-action text-danger" onClick={handleDeleteAll} style={{ cursor: 'pointer' }}>
                    全記録を削除
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input 
              type="text"
              className="form-control"
              placeholder="氏名、学年、カテゴリ、本文で検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-end">
            <label className="form-label me-3 mb-0">文字サイズ:</label>
            <div className="btn-group" role="group">
              <button type="button" className={`btn btn-outline-primary ${fontSize === 14 ? 'active' : ''}`} onClick={() => setFontSize(14)}>小</button>
              <button type="button" className={`btn btn-outline-primary ${fontSize === 16 ? 'active' : ''}`} onClick={() => setFontSize(16)}>普通</button>
              <button type="button" className={`btn btn-outline-primary ${fontSize === 19 ? 'active' : ''}`} onClick={() => setFontSize(19)}>大</button>
              <button type="button" className={`btn btn-outline-primary ${fontSize === 22 ? 'active' : ''}`} onClick={() => setFontSize(22)}>特大</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Calendar onDateClick={handleDateClick} interviews={interviews} highlightDates={searchQuery ? filteredInterviews.map(i => i.date) : []} />
      </main>

      {selectedDate && (
        <InterviewModal 
          date={selectedDate}
          records={currentInterviewData?.records || []}
          onClose={handleModalClose}
          onSave={handleSave}
          onDeleteDate={handleDeleteDate}
        />
      )}

      <footer className="pt-3 mt-4 text-muted border-top">
        <p className="mb-0">&copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
