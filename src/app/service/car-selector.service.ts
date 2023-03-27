import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../component/model/car.interface';

@Injectable({
  providedIn: 'root'
})
export class CarSelectorService {
  private apiUrl = 'http://localhost:3000/api/cars'; // replace with your API URL

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    const url = `${this.apiUrl}/cars`;
    return this.http.get<Car[]>(url);
  }

  getMakes(): Observable<string[]> {
    const url = `${this.apiUrl}/makes`;
    return this.http.get<string[]>(url);
  }

  getModelsByMake(make: string): Observable<string[]> {
    const url = `${this.apiUrl}/models/${make}`;
    return this.http.get<string[]>(url);
  }

  getYearsByMakeAndModel(make: string, model: string): Observable<number[]> {
    const url = `${this.apiUrl}/years/${make}/${model}`;
    return this.http.get<number[]>(url);
  }

getTrimEnginesByCar(car: Car): Observable<any> {
    const { make, model, year } = car;
    const url = `${this.apiUrl}/trims`;
    const body = { make, model, year };
    return this.http.post<any>(url, body);
  }
  
  
}
