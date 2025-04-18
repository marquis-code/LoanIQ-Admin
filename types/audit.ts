// types/audit.ts

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export interface AuditDetail {
  field?: string;
  oldValue?: any;
  newValue?: any;
  entityType?: string;
  entityId?: string;
  browser?: string;
  device?: string;
  location?: string;
  [key: string]: any;
}

export interface Audit {
  id: string;
  adminName: string;
  action: AuditAction;
  description: string;
  datetime: string;
  details?: AuditDetail;
}