export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'user';
    };
    token: string;
  }