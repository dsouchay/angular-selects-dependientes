import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl:string = 'https://restcountries.com/v3.1';
  private _regiones:string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones():string[]{
    return [...this._regiones];
  }

  constructor(private http:HttpClient) { }

  getPaisesPorRegion(region:string):Observable<PaisSmall[]>{
    return this.http.get<PaisSmall[]>(`${this.baseUrl}/region/${region}?fields=name,cca3`)
  }
 // getFronterasPais(codPais:string):Observable<Pais[]>{
   // return this.http.get<Country[]>(`${this.baseUrl}/alpha/${codPais}?fields=borders`)
 // }
  getPaisPorCodigo(codPais:string):Observable<Pais[] | null>{
    if (!codPais) return of(null);
    return this.http.get<Pais[]>(`${this.baseUrl}/alpha/${codPais}`);
  }
  getPaisPorCodigoSmall(codPais:string):Observable<PaisSmall[] | null>{
    if (!codPais) return of([]);
    return this.http.get<PaisSmall[]>(`${this.baseUrl}/alpha/?codes=${codPais}&fields=name,cca3`);
  }
}
