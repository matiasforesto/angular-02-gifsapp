import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
 
  private apikey: string = 'qegtqA4SOaw1dv32EJyL29x5G957Awmn';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[]=[];
  public resultados: Gif[]=[];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    
    //traemos del local storage
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query:string = ''){

    //la busqueda se graba en minuscula
    query = query.trim().toLowerCase();

    //No grabar vacios
    if(query.length===0){
      return;
    }
    
    //nos fijamos que elemento a buscar no este en el historial
    if(!this._historial.includes(query)){
      //insertamos elemento buscado
      this._historial.unshift(query);
      //cortamos y solo dejemos los primeros 10
      this._historial = this._historial.splice(0,10);

      //agregamos al local storage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    
    const params = new HttpParams()
    .set('api_key', this.apikey)
    .set('limit', '10')
    .set('q', query);

    //uso de observable con modulo core HttpClientModule de Angular
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
    .subscribe( (resp) =>{
      //console.log(resp.data);
      this.resultados=resp.data;
      //agregamos al local storage
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    });
    
  }//fin buscarGifs

}
