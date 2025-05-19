import api from './axios';

export interface Report {
  id: number;
  filename: string;
  result: string;
  timestamp: string;
}

export const reportApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Report>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getResults: () => api.get<Report[]>('/results'),
  updateStatus: (reportId: number, status: string) => 
    api.put<Report>(`/results/${reportId}/status`, { status }),
}; 