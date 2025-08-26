export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type RootStackParamList = {
  index: undefined;
  auth: undefined;
  'pin-setup': undefined;
  'password-list': undefined;
  'add-password': { passwordId?: string };
  'password-details': { passwordId: string };
};
