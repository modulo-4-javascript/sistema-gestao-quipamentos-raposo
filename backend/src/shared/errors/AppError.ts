export type AppErrorField = {
  field: string;
  message: string;
};

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly fields?: AppErrorField[]
  ) {
    super(message);
    this.name = "AppError";
  }
}
