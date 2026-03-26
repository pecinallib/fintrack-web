export interface ActivityLog {
  id: number;
  action: 'create' | 'update' | 'delete';
  entity: 'transaction' | 'category';
  entityId: number;
  details: string | null;
  createdAt: string;
  userId: number;
}
