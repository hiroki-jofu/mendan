import React, { useRef, useState, useEffect } from 'react';
import mendanKirokuLogo from '../mendan-kiroku-logo.svg';


interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onExportCsv: () => void;
  onBackupToFile: () => void;
  onRestoreFromFile: () => void;
  onDeleteAll: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  fontSize, 
  onFontSizeChange, 
  onExportCsv, 
  onBackupToFile,
  onRestoreFromFile,
  onDeleteAll 
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  

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

  const handleExport = () => {
    setMenuOpen(false);
    onExportCsv();
  }

  const handleDelete = () => {
    setMenuOpen(false);
    onDeleteAll();
  }

  const handleBackupToFileClick = () => {
    setMenuOpen(false);
    onBackupToFile();
  };

  const handleRestoreFromFileClick = () => {
    setMenuOpen(false);
    onRestoreFromFile();
  };

  return (
    <header className="pb-3 mb-4 app-header">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-4 mb-0 app-title">
          <img src={mendanKirokuLogo} alt="面談記録アプリ ロゴ" style={{ height: '40px', marginRight: '10px' }} />
          面談記録アプリ
        </h1>
        <div className="position-relative" ref={menuRef}>
          <button className="btn btn-outline-secondary" onClick={() => setMenuOpen(!isMenuOpen)}>
            メニュー
          </button>
          {isMenuOpen && (
            <div className="card position-absolute" style={{ width: '280px', top: '100%', right: 0, zIndex: 10 }}>
              <ul className="list-group list-group-flush">
                <li className="list-group-item list-group-item-action" onClick={handleExport} style={{ cursor: 'pointer' }}>
                  記録をExcel形式で書き出す
                </li>
                <li className="list-group-item list-group-item-action" onClick={handleBackupToFileClick} style={{ cursor: 'pointer' }}>
                  データをファイルにバックアップ
                </li>
                <li className="list-group-item list-group-item-action" onClick={handleRestoreFromFileClick} style={{ cursor: 'pointer' }}>
                  バックアップファイルから復元
                </li>
                <li className="list-group-item list-group-item-action text-danger" onClick={handleDelete} style={{ cursor: 'pointer' }}>
                  全記録を削除
                </li>
                
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="row g-3 align-items-center">
        <div className="col-md-6 position-relative">
          <input 
            type="text"
            className="form-control"
            placeholder="氏名、学年、カテゴリ、本文で検索..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="btn-close" 
              style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)' }} 
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            ></button>
          )}
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-end">
          <label className="form-label me-3 mb-0">文字サイズ:</label>
          <div className="btn-group" role="group">
            <button type="button" className={`btn btn-outline-primary ${fontSize === 14 ? 'active' : ''}`} onClick={() => onFontSizeChange(14)}>小</button>
            <button type="button" className={`btn btn-outline-primary ${fontSize === 16 ? 'active' : ''}`} onClick={() => onFontSizeChange(16)}>普通</button>
            <button type="button" className={`btn btn-outline-primary ${fontSize === 19 ? 'active' : ''}`} onClick={() => onFontSizeChange(19)}>大</button>
            <button type="button" className={`btn btn-outline-primary ${fontSize === 22 ? 'active' : ''}`} onClick={() => onFontSizeChange(22)}>特大</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
