import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { httpOptions } from '../environment/httpOptions';
import { environment } from '../environment/environment';
import { baseId } from '../models/baseId';
import { Type } from '@angular/compiler';
import { TableURL } from '../tools/table-url';

@Injectable({
  providedIn: 'root'
})

export class GenericService<T>
{
  private readonly apiUrl: string;

  constructor(private http: HttpClient /*@Inject('path') private path: string*/)
  {
    this.apiUrl = `${environment.apiUrl}`;
  }

  getAll(url:string): Observable<T[]>
  {
    return this.http.get<T[]>(`${this.apiUrl}${url}`);
  }

  getById(url:string, id: number): Observable<T>
  {
    return this.http.get<T>(`${this.apiUrl}${url}${id}`);
  }

  // httpOptionsLocal={
  //   headers: new HttpHeaders({
  //     'content-type' : 'application/json'
  //   })
  // }

  create(url:string, item: T): Observable<T>
  {
    return this.http.post<T>(this.apiUrl + url, item, httpOptions);
  }

  update(url:string, item: T): Observable<T>
  {
    return this.http.put<T>(`${this.apiUrl}${url}${(item as baseId).id}`, item, httpOptions);
  }

  delete(url:string, id: number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}${url}${id}`);
  }
}