import React, { useState, useEffect } from 'react';

interface DiaryModalProps {
  date: Date | null;
  content: string;
  onClose: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
}

const DiaryModal: React.FC<DiaryModalProps> = ({ date, content, onClose, onSave, onDelete }) => {
  const [text, setText] = useState(content);

  useEffect(() => {
    setText(content);
  }, [content]);

  if (!date) return null;

  const handleSave = () => {
    onSave(text);
  };

  const handleDelete = () => {
    if (window.confirm('この日の日記を削除しますか？')) {
      onDelete();
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{date.toLocaleDateString('ja-JP')} の日記</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea 
              className="form-control" 
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>削除</button>
            <div>
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>閉じる</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
