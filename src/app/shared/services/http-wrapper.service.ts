// http-wrapper.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { StandardResponse } from '../models/standard-response.model';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class HttpWrapperService {
  genericError = '';
  constructor(public http: HttpClient) {
    this.genericError = `Error occcured!`;
  }

  get<T>(url: string): Observable<StandardResponse<T>> {
    let response = this.http.get<StandardResponse<T>>(url);

    return Observable.create((observer: Observer<any>) => {
      response.subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error([
            { title: error.name, detail: this.genericError, error },
          ]);
        }
      );
    });
  }

  post<T>(url: string, body: object): Observable<StandardResponse<T>> {
    console.log('output Response for Body', body);
    let response = this.http.post<StandardResponse<T>>(url, body);

    return new Observable<StandardResponse<T>>((observer) => {
      response.subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error([
            { title: error.name, detail: this.genericError, error },
          ]);
        }
      );
    });
  }
  
  put<T>(url: string, body: object): Observable<StandardResponse<T>> {
    console.log('output Response for Body', body);

    let response = this.http.put<StandardResponse<T>>(url, body);
    return Observable.create((observer: Observer<any>) => {
      response.subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error([
            { title: error.name, detail: this.genericError, error },
          ]);
        }
      );
    });
  }
  
  delete<T>(url: string): Observable<StandardResponse<T>> {
    let response = this.http.delete<StandardResponse<T>>(url);

    return Observable.create((observer: Observer<any>) => {
      response.subscribe(
        (res) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error([
            { title: error.name, detail: this.genericError, error },
          ]);
        }
      );
    });
  }
}
