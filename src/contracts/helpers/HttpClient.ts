import axios, { AxiosRequestConfig, CancelTokenSource, AxiosInstance } from 'axios';
import { ErrorResponse, SuccessResponse, IServerError } from '@vannatta-software/ts-core';

export interface HttpClientConfig extends Omit<AxiosRequestConfig, 'url'> {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export interface RequestConfig extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
    headers?: Record<string, string>;
    timeout?: number;
}

export interface RequestOptions<P = any> {
    params?: P;
    config?: RequestConfig;
    cancelToken?: CancelTokenSource;
}

export interface IHttpRequest<T = any> {
    execute(options?: RequestOptions<any>): Promise<T>;
}

export interface IHttpClient {
    get<T, Q = any>(path: string): { execute(options?: RequestOptions<Q>): Promise<T> };
    post<T, C = any>(path: string): { execute(command: C, options?: RequestOptions): Promise<T> };
    put<T, C = any>(path: string): { execute(command: C, options?: RequestOptions): Promise<T> };
    patch<T, C = any>(path: string): { execute(command: C, options?: RequestOptions): Promise<T> };
    delete<T, C = any>(path: string): { execute(command: C, options?: RequestOptions): Promise<T> };
    addMiddleware(fn: (config: RequestConfig) => RequestConfig);
    createCancelToken(): CancelTokenSource
    
}


export class HttpClient implements IHttpClient {
    private axiosInstance: AxiosInstance;
    private middleware: ((config: RequestConfig) => RequestConfig)[] = [];

    constructor(config: HttpClientConfig = {}) {
        const defaultConfig: HttpClientConfig = {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            },
            ...config
        };

        this.axiosInstance = axios.create(defaultConfig);
    }

    public addMiddleware(fn: (config: RequestConfig) => RequestConfig): void {
        this.middleware.push(fn);
    }

    private applyMiddleware(config: RequestConfig): RequestConfig {
        return this.middleware.reduce((cfg, fn) => fn(cfg), config);
    }

    public createCancelToken(): CancelTokenSource {
        return axios.CancelToken.source();
    }

    private async handleRequest<T>(request: Promise<any>): Promise<T> {
        try {
            const response = await request;
            return new SuccessResponse<T>(response).data as T;
        } catch (error: any) {
            if (axios.isCancel(error)) {
                throw new Error('Request cancelled');
            }
            throw new ErrorResponse<T>(error as IServerError<T>);
        }
    }

    private replaceUrlPlaceholders(url: string, params: Record<string, any>): string {
        return Object.keys(params).reduce((accUrl, key) => {
            return accUrl.replace(`{${key}}`, encodeURIComponent(params[key]));
        }, url);
    }

    public get<T, Q = any>(url: string) {
        return {
            execute: async (options: RequestOptions<Q> = {}): Promise<T> => {
                const { params, config, cancelToken } = options;
                const finalUrl = params ? this.replaceUrlPlaceholders(url, params as any) : url;
                const finalConfig = this.applyMiddleware({
                    ...config,
                    params,
                    cancelToken: cancelToken?.token
                });

                return this.handleRequest<T>(this.axiosInstance.get(finalUrl, finalConfig));
            }
        };
    }

    public post<T, C = any>(url: string) {
        return {
            execute: async (command: C, options: RequestOptions = {}): Promise<T> => {
                const { config, cancelToken } = options;
                const finalUrl = this.replaceUrlPlaceholders(url, command as any);
                const finalConfig = this.applyMiddleware({
                    ...config,
                    cancelToken: cancelToken?.token
                });

                return this.handleRequest<T>(this.axiosInstance.post(finalUrl, command, finalConfig));
            }
        };
    }

    public put<T, C = any>(url: string) {
        return {
            execute: async (command: C, options: RequestOptions = {}): Promise<T> => {
                const { config, cancelToken } = options;
                const finalUrl = this.replaceUrlPlaceholders(url, command as any);
                const finalConfig = this.applyMiddleware({
                    ...config,
                    cancelToken: cancelToken?.token
                });

                return this.handleRequest<T>(this.axiosInstance.put(finalUrl, command, finalConfig));
            }
        };
    }

    public patch<T, C = any>(url: string) {
        return {
            execute: async (command: C, options: RequestOptions = {}): Promise<T> => {
                const { config, cancelToken } = options;
                const finalUrl = this.replaceUrlPlaceholders(url, command as any);
                const finalConfig = this.applyMiddleware({
                    ...config,
                    cancelToken: cancelToken?.token
                });

                return this.handleRequest<T>(this.axiosInstance.patch(finalUrl, command, finalConfig));
            }
        };
    }

    public delete<T, C = any>(url: string) {
        return {
            execute: async (command: C, options: RequestOptions = {}): Promise<T> => {
                const { config, cancelToken } = options;
                const finalUrl = this.replaceUrlPlaceholders(url, command as any);
                const finalConfig = this.applyMiddleware({
                    ...config,
                    cancelToken: cancelToken?.token
                });

                return this.handleRequest<T>(this.axiosInstance.delete(finalUrl, {
                    ...finalConfig,
                    data: command
                }));
            }
        };
    }
}

// Export a default instance for backwards compatibility
export const http = new HttpClient();
