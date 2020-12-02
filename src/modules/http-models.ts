export interface HttpRequest {
  headers?: Record<string, string>;
  pathParameters?: Record<string, string>;
  queryStringParameters?: Record<string, string[]>;
  body?: string;
}

export interface HttpResponse {
  statusCode: number;
  body?: string;
}
