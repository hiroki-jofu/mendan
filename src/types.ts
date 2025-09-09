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
