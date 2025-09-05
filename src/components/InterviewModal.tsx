import React, { useState, useEffect } from 'react';
import { InterviewRecord } from '../App';

// 定数
const departmentOptions = [
  "教育学部", "人文学部", "理学部", "工学部", "都市デザイン学部",
  "人文社会芸術総合研究科", "理工学研究科", "教職実践開発研究科", "その他"
];
const categoryOptions = [
  "個人面談", "志願票指導", "小論文指導", "模擬授業", "集団論文"
];

// 新しい空の記録を作成するヘルパー関数
const createNewRecord = (): InterviewRecord => ({
  id: Date.now().toString() + Math.random().toString(36),
  studentName: '',
  studentGrade: '1', // デフォルト値を'1'に設定
  studentDepartment: departmentOptions[0],
  category: categoryOptions[0],
  content: ''
});

interface InterviewModalProps {
  date: Date;
  records: InterviewRecord[];
  onClose: () => void;
  onSave: (records: InterviewRecord[]) => void;
  onDeleteDate: () => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({ date, records, onClose, onSave, onDeleteDate }) => {
  const [localRecords, setLocalRecords] = useState<InterviewRecord[]>([]);

  useEffect(() => {
    // モーダルが開かれたときに、propsのrecordsをローカルstateにコピーする
    // recordsが空（新規）の場合、空の入力欄を1つ表示する
    setLocalRecords(records.length > 0 ? records.map(r => ({...r})) : [createNewRecord()]);
  }, [records]);

  // 記録のフィールドを更新する関数
  const handleRecordChange = (id: string, field: keyof InterviewRecord, value: string) => {
    setLocalRecords(localRecords.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // 新しい記録欄を追加する関数
  const addRecord = () => {
    setLocalRecords([...localRecords, createNewRecord()]);
  };

  // 記録欄を削除する関数
  const removeRecord = (id: string) => {
    setLocalRecords(localRecords.filter(r => r.id !== id));
  };

  // 保存処理
  const handleSave = () => {
    // 空のレコードは保存しない
    const recordsToSave = localRecords.filter(r => r.studentName.trim() !== '' || r.content.trim() !== '');
    onSave(recordsToSave);
  };

  // 日付ごとの削除処理
  const handleDelete = () => {
    if (window.confirm('この日のすべての記録を削除しますか？')) {
      onDeleteDate();
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{date.toLocaleDateString('ja-JP')} の面談記録</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {localRecords.map((record, index) => (
              <div key={record.id} className="p-3 mb-3 border rounded position-relative shadow-sm bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 text-primary">記録 {index + 1}</h6>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeRecord(record.id)}>この記録を削除</button>
                </div>
                <div className="row g-3">
                  {/* 学生情報 */}
                  <div className="col-md-4">
                    <label className="form-label">氏名</label>
                    <input type="text" className="form-control" value={record.studentName} onChange={(e) => handleRecordChange(record.id, 'studentName', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">学年</label>
                    <select className="form-select" value={record.studentGrade} onChange={(e) => handleRecordChange(record.id, 'studentGrade', e.target.value)}>
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">学生所属</label>
                    <select className="form-select" value={record.studentDepartment} onChange={(e) => handleRecordChange(record.id, 'studentDepartment', e.target.value)}>
                      {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  {/* 面談内容 */}
                  <div className="col-12">
                    <label className="form-label">面談カテゴリー</label>
                    <select className="form-select" value={record.category} onChange={(e) => handleRecordChange(record.id, 'category', e.target.value)}>
                      {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">本文</label>
                    <textarea
                      className="form-control"
                      rows={8}
                      value={record.content}
                      onChange={(e) => handleRecordChange(record.id, 'content', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addRecord}>
              ＋ 面談記録を追加
            </button>
          </div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={records.length === 0}>
              この日の記録を全て削除
            </button>
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

export default InterviewModal;
