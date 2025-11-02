export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  preferences: UserPreferences;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  newReleases: boolean;
  recommendations: boolean;
  newsletter: boolean;
  language: string;
  currency: string;
}

export interface UserAddress {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type ProfileUpdateData = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  preferences: Partial<UserPreferences>;
}>;

export type AddressUpdateData = Omit<UserAddress, 'id'>;
