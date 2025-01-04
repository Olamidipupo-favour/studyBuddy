export interface DashboardStats {
  totalNotes: number;
  totalFolders: number;
  recentSummaries: number;
  totalSummaries: number;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  totalTopics?: number;
  totalQuestions?: number;
} 