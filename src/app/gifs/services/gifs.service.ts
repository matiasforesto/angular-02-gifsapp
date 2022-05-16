import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
 
  private apikey: string = 'qegtqA4SOaw1dv32EJyL29x5G957Awmn';
  private _historial: string[]=[];
  public resultados: Gif[]=[];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    
    //traemos del local storage
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    /*if(localStorage.getItem('historial')){
      this._historial= JSON.parse(localStorage.getItem('historial')!);
    }*/

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

      //agregamo al local storage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    
    //uso de observable con modulo core HttpClientModule de Angular
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apikey}&q=${query}&limit=10`)
    .subscribe( (resp) =>{
      console.log(resp.data);
      this.resultados=resp.data;
    });
    
  }//fin buscarGifs

}
