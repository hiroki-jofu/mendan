import React, { useState } from 'react';
import './Calendar.css';
import { DiaryEntry } from '../App'; // App.tsxから型をインポート

// 日付をYYYY-MM-DD形式の文字列に変換するヘルパー関数
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface CalendarProps {
  onDateClick: (date: Date) => void;
  diaries: DiaryEntry[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, diaries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth - 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // Days from previous month
    for (let i = 0; i < startDay; i++) {
      const day = new Date(year, month, i - startDay + 1);
      calendarDays.push(
        <div key={formatDate(day)} className="day-cell not-current-month" onClick={() => onDateClick(day)}>
          <div className="day-number">{day.getDate()}</div>
        </div>
      );
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDate(date);
      const isToday = dateStr === formatDate(today);
      const diary = diaries.find(d => d.date === dateStr);

      const dayClasses = ['day-cell'];
      if (isToday) dayClasses.push('today');

      calendarDays.push(
        <div key={dateStr} className={dayClasses.join(' ')} onClick={() => onDateClick(date)}>
          <div className="day-number">{i}</div>
          {diary && (
            <div className="diary-preview">
              {diary.content}
            </div>
          )}
        </div>
      );
    }

    // Days from next month
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      const day = new Date(year, month + 1, i);
      calendarDays.push(
        <div key={formatDate(day)} className="day-cell not-current-month" onClick={() => onDateClick(day)}>
          <div className="day-number">{day.getDate()}</div>
        </div>
      );
    }
    
    return calendarDays;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const yearOptions = Array.from({ length: 21 }, (_, i) => year - 10 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-primary" onClick={goToPreviousMonth}>&lt; 前月</button>
        <div className="d-flex align-items-center">
          <select className="form-select me-2" style={{ width: '110px' }} value={year} onChange={handleYearChange}>
            {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select className="form-select" value={month} onChange={handleMonthChange}>
            {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
          </select>
        </div>
        <button className="btn btn-outline-primary" onClick={goToNextMonth}>次月 &gt;</button>
      </div>
      <div className="calendar-grid text-center">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="fw-bold border py-2">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar;