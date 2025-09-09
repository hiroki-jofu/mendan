import React from 'react';
import { InterviewRecord } from '../types';

interface SearchResultListProps {
  searchQuery: string;
  matchingRecords: (InterviewRecord & { date: string })[];
}

const SearchResultList: React.FC<SearchResultListProps> = ({ searchQuery, matchingRecords }) => {
  if (!searchQuery) return null;

  if (matchingRecords.length === 0) {
    return (
      <div className="mt-4 alert alert-info">
        検索条件に一致する記録は見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="fs-5 mb-3">検索結果 ({matchingRecords.length}件)</h3>
      <div className="list-group">
        {matchingRecords.map(record => (
          <div key={record.id} className="list-group-item list-group-item-action flex-column align-items-start mb-2">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{record.studentName} ({record.studentGrade}年)</h5>
              <small className="text-muted">{record.date}</small>
            </div>
            <p className="mb-1">所属: {record.studentDepartment} / カテゴリー: {record.category}</p>
            <small className="text-muted">本文: {record.content.substring(0, 100)}{record.content.length > 100 ? '...' : ''}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultList;
