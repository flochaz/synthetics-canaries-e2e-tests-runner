export default class CanaryFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanaryFailedError';
  }
}