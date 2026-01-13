import axios, { AxiosInstance } from 'axios';

export class DelhiveryClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: process.env.DELHIVERY_BASE_URL,
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  get<T>(url: string, params?: any): Promise<T> {
    return this.client.get(url, { params }).then(r => r.data);
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data).then(r => r.data);
  }
}
