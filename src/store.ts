import { create } from 'zustand';
import { openDB } from 'idb';
import { InterviewData, InterviewRecord } from './types';

const DB_NAME = 'diary-app-db';
const STORE_NAME = 'interviews';
const DATA_KEY = 'all-interviews';

// --- IndexedDB for Interview Data --- //
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

const saveDataToDB = async (data: InterviewData[]) => {
  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, data, DATA_KEY);
  } catch (error) {
    console.error('Failed to save data to IndexedDB:', error);
  }
};

const loadDataFromDB = async (): Promise<InterviewData[]> => {
  try {
    const db = await dbPromise;
    return (await db.get(STORE_NAME, DATA_KEY)) || [];
  } catch (error) {
    console.error('Failed to load data from IndexedDB:', error);
    return [];
  }
};

// --- Zustand Store --- //

interface InterviewState {
  interviews: InterviewData[];
  isInitialized: boolean;
  initializeApp: () => Promise<void>;
  addInterview: (date: string, records: InterviewRecord[]) => void;
  updateInterview: (date: string, records: InterviewRecord[]) => void;
  deleteInterview: (date: string) => void;
  deleteAllInterviews: () => void;
  setInterviews: (data: InterviewData[]) => void;
}

const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: [],
  isInitialized: false,

  initializeApp: async () => {
    const interviews = await loadDataFromDB();
    set({ interviews, isInitialized: true });
  },

  addInterview: (date, records) => {
    const { interviews } = get();
    const updatedInterviews = [...interviews, { date, records }];
    set({ interviews: updatedInterviews });
    saveDataToDB(updatedInterviews);
  },

  updateInterview: (date, records) => {
    const { interviews } = get();
    const updatedInterviews = interviews.map((i) => (i.date === date ? { ...i, records } : i));
    set({ interviews: updatedInterviews });
    saveDataToDB(updatedInterviews);
  },

  deleteInterview: (date) => {
    const { interviews } = get();
    const updatedInterviews = interviews.filter((i) => i.date !== date);
    set({ interviews: updatedInterviews });
    saveDataToDB(updatedInterviews);
  },

  deleteAllInterviews: () => {
    set({ interviews: [] });
    saveDataToDB([]);
  },

  setInterviews: (data) => {
    set({ interviews: data });
    saveDataToDB(data);
  },
}));

export default useInterviewStore;
