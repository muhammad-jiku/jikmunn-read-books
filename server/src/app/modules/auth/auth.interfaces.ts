export interface ILoginUser {
  id: string;
  password: string;
}

export interface ILoginUserResponse {
  accessToken: string;
  refreshToken?: string;
  needsPasswordChange: boolean;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
