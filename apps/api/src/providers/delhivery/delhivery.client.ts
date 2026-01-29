import axios, { AxiosInstance } from 'axios';

export class DelhiveryClient {
  private client: AxiosInstance;
  private DELHIVERY_BASE_URL='https://track.delhivery.com';
  private track: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: this.DELHIVERY_BASE_URL,
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.track = axios.create({
      baseURL: this.DELHIVERY_BASE_URL,
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

  trackGet<T>(url: string, params?: any) {
    return this.track.get<T>(url, { params }).then(r => r.data);
  }

  trackPost<T = any>(url: string, data?: any): Promise<T> {
    return this.track.post(url, data).then(r => r.data);
  }
}
