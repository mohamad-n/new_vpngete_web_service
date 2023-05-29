import { HttpStatus } from '@nestjs/common';
import axios, { Method } from 'axios';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

export interface AxiosRequestConfig<T = any> {
  url?: string;
  method?: Method;
  baseURL?: string;
  data?: T;
  headers?: Record<string, string>;
  params?: any;
}

export interface AxiosResponse<T = never> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig<T>;
  request?: any;
}

export class AxiosService {
  async createRequest(request: AxiosRequestConfig): Promise<any> {
    const axiosRequest = axios.create();
    return axiosRequest(request)
      .then((response) => {
        return Promise.resolve(response?.data);
      })
      .catch((error) => {
        // console.log(error);
        throw new CommonException({ message: 'invalid http request' }, HttpStatus.NOT_FOUND);

        // return Promise.reject(error);
      });
  }
}
