/**
 * Comprehensive HTTP status code constants for the CertusAdiValt system.
 *
 * Provides all standard HTTP status codes as named constants for type-safe usage
 * throughout the application. Organized by HTTP status code categories (1xx-5xx).
 *
 * @namespace HttpStatus
 *
 * @example
 * ```typescript
 * // Using HTTP status codes in API responses
 * return response.status(HttpStatus.OK).json({ data: result });
 *
 * // Using in error creation
 * throw new CertusNotFoundError(
 *   'User not found',
 *   ErrorCodes.GEN_NOT_FOUND,
 *   HttpStatus.NOT_FOUND
 * );
 *
 * // Type-safe status code handling
 * function handleResponse(status: HttpStatusType) {
 *   if (status >= 200 && status < 300) {
 *     // Handle success responses
 *   } else if (status >= 400 && status < 500) {
 *     // Handle client errors
 *   }
 * }
 * ```
 */
export const HttpStatus = {
  // Informational (1xx)

  /**
   * 100 Continue
   * The server has received the request headers and the client should proceed to send the request body.
   */
  CONTINUE: 100,

  /**
   * 101 Switching Protocols
   * The requester has asked the server to switch protocols and the server has agreed to do so.
   */
  SWITCHING_PROTOCOLS: 101,

  /**
   * 102 Processing (WebDAV)
   * The server has received and is processing the request, but no response is available yet.
   */
  PROCESSING: 102,

  /**
   * 103 Early Hints
   * Used to return some response headers before final HTTP message.
   */
  EARLY_HINTS: 103,

  // Success (2xx)

  /**
   * 200 OK
   * The request has succeeded.
   */
  OK: 200,

  /**
   * 201 Created
   * The request has been fulfilled and resulted in a new resource being created.
   */
  CREATED: 201,

  /**
   * 202 Accepted
   * The request has been accepted for processing, but the processing has not been completed.
   */
  ACCEPTED: 202,

  /**
   * 203 Non-Authoritative Information
   * The server is a transforming proxy that received a 200 OK from its origin.
   */
  NON_AUTHORITATIVE_INFORMATION: 203,

  /**
   * 204 No Content
   * The server successfully processed the request and is not returning any content.
   */
  NO_CONTENT: 204,

  /**
   * 205 Reset Content
   * The server successfully processed the request, but is not returning any content and requires the requester to reset the document view.
   */
  RESET_CONTENT: 205,

  /**
   * 206 Partial Content
   * The server is delivering only part of the resource due to a range header sent by the client.
   */
  PARTIAL_CONTENT: 206,

  /**
   * 207 Multi-Status (WebDAV)
   * The message body that follows is an XML message and can contain a number of separate response codes.
   */
  MULTI_STATUS: 207,

  /**
   * 208 Already Reported (WebDAV)
   * The members of a DAV binding have already been enumerated in a previous reply to this request.
   */
  ALREADY_REPORTED: 208,

  /**
   * 226 IM Used
   * The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
   */
  IM_USED: 226,

  // Redirection (3xx)

  /**
   * 300 Multiple Choices
   * The request has more than one possible response and the user should choose one.
   */
  MULTIPLE_CHOICES: 300,

  /**
   * 301 Moved Permanently
   * The URL of the requested resource has been changed permanently.
   */
  MOVED_PERMANENTLY: 301,

  /**
   * 302 Found
   * The URI of requested resource has been changed temporarily.
   */
  FOUND: 302,

  /**
   * 303 See Other
   * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
   */
  SEE_OTHER: 303,

  /**
   * 304 Not Modified
   * Used for caching purposes. The client can continue to use the same cached version of the response.
   */
  NOT_MODIFIED: 304,

  /**
   * 305 Use Proxy
   * The requested resource is available only through a proxy, the address for which is provided in the response.
   */
  USE_PROXY: 305,

  /**
   * 307 Temporary Redirect
   * The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request.
   */
  TEMPORARY_REDIRECT: 307,

  /**
   * 308 Permanent Redirect
   * This means that the resource is now permanently located at another URI.
   */
  PERMANENT_REDIRECT: 308,

  // Client errors (4xx)

  /**
   * 400 Bad Request
   * The server cannot or will not process the request due to an apparent client error.
   */
  BAD_REQUEST: 400,

  /**
   * 401 Unauthorized
   * The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  UNAUTHORIZED: 401,

  /**
   * 402 Payment Required
   * Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.
   */
  PAYMENT_REQUIRED: 402,

  /**
   * 403 Forbidden
   * The server understood the request but refuses to authorize it.
   */
  FORBIDDEN: 403,

  /**
   * 404 Not Found
   * The server cannot find the requested resource.
   */
  NOT_FOUND: 404,

  /**
   * 405 Method Not Allowed
   * The request method is known by the server but has been disabled and cannot be used.
   */
  METHOD_NOT_ALLOWED: 405,

  /**
   * 406 Not Acceptable
   * The server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers.
   */
  NOT_ACCEPTABLE: 406,

  /**
   * 407 Proxy Authentication Required
   * The client must first authenticate itself with the proxy.
   */
  PROXY_AUTHENTICATION_REQUIRED: 407,

  /**
   * 408 Request Timeout
   * The server would like to shut down this unused connection.
   */
  REQUEST_TIMEOUT: 408,

  /**
   * 409 Conflict
   * The request could not be completed due to a conflict with the current state of the target resource.
   */
  CONFLICT: 409,

  /**
   * 410 Gone
   * The target resource is no longer available at the origin server and this condition is likely to be permanent.
   */
  GONE: 410,

  /**
   * 411 Length Required
   * The server refuses to accept the request without a defined Content-Length.
   */
  LENGTH_REQUIRED: 411,

  /**
   * 412 Precondition Failed
   * One or more conditions given in the request header fields evaluated to false when tested on the server.
   */
  PRECONDITION_FAILED: 412,

  /**
   * 413 Payload Too Large
   * The server is refusing to process a request because the request payload is larger than the server is willing or able to process.
   */
  PAYLOAD_TOO_LARGE: 413,

  /**
   * 414 URI Too Long
   * The server is refusing to service the request because the request-target is longer than the server is willing to interpret.
   */
  URI_TOO_LONG: 414,

  /**
   * 415 Unsupported Media Type
   * The server is refusing to service the request because the entity of the request is in a format not supported by the target resource for the requested method.
   */
  UNSUPPORTED_MEDIA_TYPE: 415,

  /**
   * 416 Range Not Satisfiable
   * The range specified by the Range header field in the request cannot be fulfilled.
   */
  RANGE_NOT_SATISFIABLE: 416,

  /**
   * 417 Expectation Failed
   * The expectation given in the request's Expect header field could not be met by at least one of the inbound servers.
   */
  EXPECTATION_FAILED: 417,

  /**
   * 418 I'm a teapot (RFC 2324)
   * The server refuses the attempt to brew coffee with a teapot.
   */
  IM_A_TEAPOT: 418,

  /**
   * 421 Misdirected Request
   * The request was directed at a server that is not able to produce a response.
   */
  MISDIRECTED_REQUEST: 421,

  /**
   * 422 Unprocessable Entity (WebDAV)
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_ENTITY: 422,

  /**
   * 423 Locked (WebDAV)
   * The resource that is being accessed is locked.
   */
  LOCKED: 423,

  /**
   * 424 Failed Dependency (WebDAV)
   * The request failed due to failure of a previous request.
   */
  FAILED_DEPENDENCY: 424,

  /**
   * 425 Too Early
   * The server is unwilling to risk processing a request that might be replayed.
   */
  TOO_EARLY: 425,

  /**
   * 426 Upgrade Required
   * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
   */
  UPGRADE_REQUIRED: 426,

  /**
   * 428 Precondition Required
   * The origin server requires the request to be conditional.
   */
  PRECONDITION_REQUIRED: 428,

  /**
   * 429 Too Many Requests
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS: 429,

  /**
   * 431 Request Header Fields Too Large
   * The server is unwilling to process the request because its header fields are too large.
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

  /**
   * 451 Unavailable For Legal Reasons
   * The server is denying access to the resource as a consequence of a legal demand.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // Server errors (5xx)

  /**
   * 500 Internal Server Error
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 500,

  /**
   * 501 Not Implemented
   * The server does not support the functionality required to fulfill the request.
   */
  NOT_IMPLEMENTED: 501,

  /**
   * 502 Bad Gateway
   * The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
   */
  BAD_GATEWAY: 502,

  /**
   * 503 Service Unavailable
   * The server is currently unable to handle the request due to temporary overloading or maintenance of the server.
   */
  SERVICE_UNAVAILABLE: 503,

  /**
   * 504 Gateway Timeout
   * The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.
   */
  GATEWAY_TIMEOUT: 504,

  /**
   * 505 HTTP Version Not Supported
   * The server does not support the HTTP protocol version used in the request.
   */
  HTTP_VERSION_NOT_SUPPORTED: 505,

  /**
   * 506 Variant Also Negotiates
   * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself.
   */
  VARIANT_ALSO_NEGOTIATES: 506,

  /**
   * 507 Insufficient Storage (WebDAV)
   * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
   */
  INSUFFICIENT_STORAGE: 507,

  /**
   * 508 Loop Detected (WebDAV)
   * The server detected an infinite loop while processing the request.
   */
  LOOP_DETECTED: 508,

  /**
   * 510 Not Extended
   * Further extensions to the request are required for the server to fulfill it.
   */
  NOT_EXTENDED: 510,

  /**
   * 511 Network Authentication Required
   * The client needs to authenticate to gain network access.
   */
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;

/**
 * Union type of all possible HTTP status codes in the system.
 *
 * Enables type-safe usage of HTTP status codes throughout the application
 * and provides autocomplete support in IDEs.
 *
 * @example
 * ```typescript
 * function createResponse(status: HttpStatusType, data: any) {
 *   return {
 *     status,
 *     data,
 *     timestamp: new Date().toISOString()
 *   };
 * }
 *
 * // Type-safe status code assignment
 * const successStatus: HttpStatusType = HttpStatus.CREATED;
 * const errorStatus: HttpStatusType = HttpStatus.NOT_FOUND;
 *
 * // Status code range checking
 * function isSuccessStatus(status: HttpStatusType): boolean {
 *   return status >= 200 && status < 300;
 * }
 *
 * function isClientError(status: HttpStatusType): boolean {
 *   return status >= 400 && status < 500;
 * }
 * ```
 */
export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus];
