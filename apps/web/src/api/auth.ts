import client from './client'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, RegisterRequest, TokenResponse, UserInfo } from '@/types/auth'

export function loginApi(data: LoginRequest) {
  return client.post<ApiResponse<TokenResponse>>('/v1/auth/login', data)
}

export function registerApi(data: RegisterRequest) {
  return client.post<ApiResponse<TokenResponse>>('/v1/auth/register', data)
}

export function getMeApi() {
  return client.get<ApiResponse<UserInfo>>('/v1/auth/me')
}
