export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'supervisor' | 'annotator' | 'verifier' | 'ml_engineer' | 'customer';
  status: 'active' | 'blocked';
  created_at: string;
}