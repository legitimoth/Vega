import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  upload2(vehicleId, photo) {

    var formData = new FormData();
    formData.append('file', photo);

    return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData, { "reportProgress": true })
      .pipe(map(res => res));
  }

  getPhotos(vehicleId) {
    return this.http.get(`/api/vehicles/${vehicleId}/photos`)
      .pipe(map(res => res));
  }

  upload(vehicleId, photo) {

    var formData = new FormData();
    formData.append('file', photo);
    return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData, { reportProgress: true, observe: 'events' })
      .pipe(map(event => this.getReturn(event)));
  }

  private getReturn(event) {
    const resultado = {
      atualiza: true,
      progresso: 0,
      objeto: {}
    };
    switch (event.type) {
      case HttpEventType.UploadProgress:
        resultado.progresso = Math.round(100 * event.loaded / event.total);
        resultado.objeto = {};
        resultado.atualiza = true;
        break;
      case HttpEventType.Response:
        resultado.objeto = event.body;
        resultado.progresso = 100;
        resultado.atualiza = true;
        break;
      default:
        resultado.atualiza = false;
        break;
    }

    return resultado;
  }

}
