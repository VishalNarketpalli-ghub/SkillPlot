export const AIErrorType = {
  AUTHENTICATION: 'AUTHENTICATION',
  QUOTA: 'QUOTA',
  RATE_LIMIT: 'RATE_LIMIT',
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  UNKNOWN: 'UNKNOWN'
};

export class AIProviderError extends Error {
  constructor(type, message, providerError = null) {
    super(message);
    this.name = 'AIProviderError';
    this.type = type;
    this.providerError = providerError;
  }
}
