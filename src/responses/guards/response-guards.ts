import {
  ApiResponse,
  EmptyResponse,
  ErrorResponse,
  PaginatedResponse,
  SuccessResponse,
} from '@/types';

/**
 * Type guard to check if an API response is a success response with data.
 *
 * Provides runtime type checking to safely determine if an API response
 * is a successful response containing a data payload. This enables
 * type-safe access to the data property in TypeScript.
 *
 * @template T - The expected type of the data payload
 * @param {ApiResponse<T>} response - The API response to check
 * @returns {response is SuccessResponse<T>} True if the response is a success response with data
 *
 * @example
 * ```typescript
 * // Type-safe response handling
 * const response = await fetchUserData();
 *
 * if (isSuccessResponse(response)) {
 *   // TypeScript now knows response is SuccessResponse<User>
 *   console.log(response.data.name); // Safe access to data
 *   console.log(response.data.email); // Safe access to data
 * }
 *
 * // In conditional logic
 * function handleResponse<T>(response: ApiResponse<T>) {
 *   if (isSuccessResponse(response)) {
 *     processData(response.data); // response.data is type T
 *     return response.data;
 *   }
 *   throw new Error('Operation failed');
 * }
 *
 * // With async/await patterns
 * async function fetchData(): Promise<User> {
 *   const response = await api.get<User>('/users/123');
 *
 *   if (isSuccessResponse(response)) {
 *     return response.data; // Type is User
 *   }
 *
 *   throw new Error('Failed to fetch user data');
 * }
 * ```
 */
export function isSuccessResponse<T = unknown>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true && 'data' in response;
}

/**
 * Type guard to check if an API response is an error response.
 *
 * Provides runtime type checking to safely determine if an API response
 * is an error response. This enables type-safe access to error details
 * and proper error handling.
 *
 * @param {ApiResponse} response - The API response to check
 * @returns {response is ErrorResponse} True if the response is an error response
 *
 * @example
 * ```typescript
 * // Safe error handling
 * const response = await apiCall();
 *
 * if (isErrorResponse(response)) {
 *   // TypeScript now knows response is ErrorResponse
 *   console.error(response.error.message); // Safe access to error
 *   console.error(response.error.code); // Safe access to error code
 *
 *   // Handle specific error types
 *   if (response.error.code === 'AUTH_INVALID_CREDENTIALS') {
 *     redirectToLogin();
 *   }
 * }
 *
 * // In error processing middleware
 * function processErrorResponse(response: ApiResponse) {
 *   if (isErrorResponse(response)) {
 *     logger.error('API Error:', {
 *       code: response.error.code,
 *       message: response.error.message,
 *       statusCode: response.error.statusCode
 *     });
 *
 *     if (response.error.statusCode >= 500) {
 *       notifyOperationsTeam(response.error);
 *     }
 *   }
 * }
 *
 * // With conditional error handling
 * function handleApiResponse(response: ApiResponse) {
 *   if (isErrorResponse(response)) {
 *     switch (response.error.statusCode) {
 *       case 401:
 *         handleUnauthorizedError(response.error);
 *         break;
 *       case 404:
 *         handleNotFoundError(response.error);
 *         break;
 *       default:
 *         handleGenericError(response.error);
 *     }
 *   }
 * }
 * ```
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false && 'error' in response;
}

/**
 * Type guard to check if an API response is a paginated response.
 *
 * Provides runtime type checking to safely determine if an API response
 * is a paginated list response. This enables type-safe access to both
 * the data array and pagination metadata.
 *
 * @template T - The expected type of items in the data array
 * @param {ApiResponse<T>} response - The API response to check
 * @returns {response is PaginatedResponse<T>} True if the response is a paginated response
 *
 * @example
 * ```typescript
 * // Handling paginated lists
 * const response = await fetchUsers({ page: 1, limit: 20 });
 *
 * if (isPaginatedResponse(response)) {
 *   // TypeScript now knows response is PaginatedResponse<User>
 *   console.log(response.data.length); // Safe access to data array
 *   console.log(response.pagination.totalPages); // Safe access to pagination
 *   console.log(response.pagination.hasNext); // Safe access to pagination
 *
 *   // Render pagination controls
 *   renderPaginationControls(response.pagination);
 * }
 *
 * // In data table components
 * function DataTable<T>({ response }: { response: ApiResponse<T[]> }) {
 *   if (isPaginatedResponse(response)) {
 *     return (
 *       <div>
 *         <Table data={response.data} />
 *         <Pagination
 *           currentPage={response.pagination.page}
 *           totalPages={response.pagination.totalPages}
 *           hasNext={response.pagination.hasNext}
 *           hasPrev={response.pagination.hasPrev}
 *         />
 *       </div>
 *     );
 *   }
 *
 *   return <ErrorMessage response={response} />;
 * }
 *
 * // With pagination utilities
 * function extractPaginationData<T>(response: ApiResponse<T[]>) {
 *   if (isPaginatedResponse(response)) {
 *     return {
 *       items: response.data,
 *       pageInfo: response.pagination,
 *       totalCount: response.pagination.total
 *     };
 *   }
 *   return null;
 * }
 * ```
 */
export function isPaginatedResponse<T = unknown>(
  response: ApiResponse<T>
): response is PaginatedResponse<T> {
  return response.success === true && 'pagination' in response;
}

/**
 * Type guard to check if an API response is an empty success response.
 *
 * Provides runtime type checking to safely determine if an API response
 * is a success response without any data payload (typically used for
 * DELETE operations or other actions that don't return data).
 *
 * @param {ApiResponse} response - The API response to check
 * @returns {response is EmptyResponse} True if the response is an empty success response
 *
 * @example
 * ```typescript
 * // Handling delete operations
 * const response = await deleteUser(userId);
 *
 * if (isEmptyResponse(response)) {
 *   // TypeScript now knows response is EmptyResponse
 *   console.log(response.message); // Safe access to optional message
 *   showSuccessNotification(response.message || 'Operation completed successfully');
 *
 *   // Refresh the UI state
 *   refreshUserList();
 * }
 *
 * // In API client methods
 * async function deleteResource(id: string): Promise<void> {
 *   const response = await api.delete(`/resources/${id}`);
 *
 *   if (isEmptyResponse(response)) {
 *     // Success - no data returned, but operation completed
 *     return;
 *   }
 *
 *   if (isErrorResponse(response)) {
 *     throw new Error(response.error.message);
 *   }
 *
 *   throw new Error('Unexpected response type');
 * }
 *
 * // With conditional UI updates
 * function handleOperationResult(response: ApiResponse) {
 *   if (isEmptyResponse(response)) {
 *     // Show success message for operations without return data
 *     showToast({
 *       type: 'success',
 *       message: response.message || 'Operation completed'
 *     });
 *     return;
 *   }
 *
 *   if (isSuccessResponse(response)) {
 *     // Show success message with data summary
 *     showToast({
 *       type: 'success',
 *       message: `Operation completed: ${response.data}`
 *     });
 *     return;
 *   }
 * }
 * ```
 */
export function isEmptyResponse(response: ApiResponse): response is EmptyResponse {
  return response.success === true && !('data' in response) && !('pagination' in response);
}
