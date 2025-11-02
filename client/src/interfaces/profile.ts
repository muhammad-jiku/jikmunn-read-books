export interface UserPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  newReleases: boolean;
  recommendations: boolean;
  newsletter: boolean;
  language: string;
  currency: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  preferences: Partial<UserPreferences>;
}

export type ProfileUpdateData = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  preferences: Partial<UserPreferences>;
}>;
