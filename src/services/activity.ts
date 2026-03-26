import api from './api';
import type { ActivityLog } from '../types/activity';

export async function getRecent(): Promise<ActivityLog[]> {
  const response = await api.get<ActivityLog[]>('/activity');
  return response.data;
}
