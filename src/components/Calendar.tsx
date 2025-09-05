import React, { useState } from 'react';
import './Calendar.css';
import { InterviewData } from '../App'; // App.tsxから型をインポート

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface CalendarProps {
  onDateClick: (date: Date) => void;
  interviews: InterviewData[];
  highlightDates: string[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, interviews, highlightDates }) => {
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

    // 前月の日付
    for (let i = 0; i < startDay; i++) {
      const day = new Date(year, month, i - startDay + 1);
      calendarDays.push(
        <div key={formatDate(day)} className="day-cell not-current-month" onClick={() => onDateClick(day)}>
          <div className="day-number">{day.getDate()}</div>
        </div>
      );
    }

    // 今月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDate(date);
      const isToday = dateStr === formatDate(today);
      const interviewData = interviews.find(d => d.date === dateStr);
      const isHighlighted = highlightDates.includes(dateStr);

      const dayClasses = ['day-cell'];
      if (isToday) dayClasses.push('today');
      if (isHighlighted) dayClasses.push('highlight');

      calendarDays.push(
        <div key={dateStr} className={dayClasses.join(' ')} onClick={() => onDateClick(date)}>
          <div className="day-number">{i}</div>
          {interviewData && interviewData.records && interviewData.records.length > 0 && (
            <div className="diary-preview">
              {/* プレビューには学生名を表示 */}
              {interviewData.records.map(r => r.studentName).join(', ')}
            </div>
          )}
        </div>
      );
    }

    // 来月の日付
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
    <div className="card">
      <div className="card-header calendar-header">
        <button className="btn btn-outline-primary" onClick={goToPreviousMonth}>&lt; 前月</button>
        <div className="calendar-controls d-flex align-items-center">
          <select className="form-select" style={{ minWidth: '7em' }} value={year} onChange={handleYearChange}>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="mx-2">年</span>
          <select className="form-select" style={{ minWidth: '6em' }} value={month} onChange={handleMonthChange}>
            {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <span className="ms-2">月</span>
        </div>
        <button className="btn btn-outline-primary" onClick={goToNextMonth}>次月 &gt;</button>
      </div>
      <div className="calendar-grid text-center">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="fw-bold border-bottom py-2">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar;