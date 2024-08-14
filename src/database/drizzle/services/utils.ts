export const createErrorResponse = (error: string) => ({ success: false, error }) as const;
export const createSuccessResponse = <T>(data: T) => ({ success: true, data }) as const;
