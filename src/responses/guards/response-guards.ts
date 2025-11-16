import {
  ApiResponse,
  EmptyResponse,
  ErrorResponse,
  PaginatedResponse,
  SuccessResponse,
} from '@/types';

export function isSuccessResponse<T = unknown>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true && 'data' in response;
}

export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false && 'error' in response;
}

export function isPaginatedResponse<T = unknown>(
  response: ApiResponse<T>
): response is PaginatedResponse<T> {
  return response.success === true && 'pagination' in response;
}

export function isEmptyResponse(response: ApiResponse): response is EmptyResponse {
  return response.success === true && !('data' in response) && !('pagination' in response);
}
