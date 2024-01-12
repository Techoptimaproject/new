export interface StandardResponse<T> {
    statusCode: number;
    message: string;
    errors: string[];
    data: T;
}