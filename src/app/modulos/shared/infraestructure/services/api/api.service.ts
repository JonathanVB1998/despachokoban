import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { DefaultOptionsHttp } from "../../../domain/models/defaultOptionsHttp";
import { environment } from "../../../../../../environments/environment";
import { Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public version: string = environment.version;
    public url: string = environment.apiUrl;
    public defaultOptions: DefaultOptionsHttp = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Sistema': environment.sistema,
            'Version': environment.version
        }),
        observe: 'body',
        responseType: 'json'
    };

    constructor(
        private httpClient: HttpClient
    ){}

    get<T>(endpoint: string, options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.get<T>(`${this.url}${endpoint}`,options || this.defaultOptions);
    }

    post<T>(endpoint: string, body: any ,options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.post<T>(`${this.url}${endpoint}`,body ,options || this.defaultOptions);
    }

    put<T>(endpoint: string, body: any ,options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.put<T>(`${this.url}${endpoint}`,body ,options || this.defaultOptions);
    }
    
    delete<T>(endpoint: string ,options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.delete<T>(`${this.url}${endpoint}` ,options || this.defaultOptions);
    }

    patch<T>(endpoint: string, body: any ,options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.patch<T>(`${this.url}${endpoint}` ,body ,options || this.defaultOptions);
    }

    uploadFile<T>(endpoint: string, formData: FormData, token?: string): Observable<any> {
        return this.httpClient.request('POST',`${this.url}${endpoint}`, {
            headers: new HttpHeaders({
                'Authorization': token ? `Bearer ${token}` : '',
                'Sistema': environment.sistema,
                'Version': environment.version
            }),
            body: formData,
            reportProgress: true,
            observe: 'events'
        });
    }

    genericRequest<T>(method: string, url: string ,options?: DefaultOptionsHttp): Observable<T> {
        return this.httpClient.request<T>(method, url, options || {observe: 'body', responseType: 'json'});
    }

    errorHandler<T>(error: HttpErrorResponse): Observable<T> {
        return throwError(() => new Error(error.message || 'server error'));
    }

}