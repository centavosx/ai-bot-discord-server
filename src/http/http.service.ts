import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios';

import { tryCatch } from '../@shared/utils/try-catch';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class HttpService {
  private axiosInstance: AxiosInstance;

  initialize(config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create(config);
  }

  private handleHttpError(error: any) {
    return new HttpException(
      error.response?.data || 'Internal Server Error',
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const [response, error] = await tryCatch(() => {
      return this.axiosInstance.get<T>(url, config);
    });

    if (error) {
      throw this.handleHttpError(error);
    }

    return response;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const [response, error] = await tryCatch(() => {
      return this.axiosInstance.post<T>(url, data, config);
    });

    if (error) {
      throw this.handleHttpError(error);
    }

    return response;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const [response, error] = await tryCatch(() => {
      return this.axiosInstance.put<T>(url, data, config);
    });

    if (error) {
      throw this.handleHttpError(error);
    }

    return response;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const [response, error] = await tryCatch(() => {
      return this.axiosInstance.delete<T>(url, config);
    });

    if (error) {
      throw this.handleHttpError(error);
    }

    return response;
  }
}
