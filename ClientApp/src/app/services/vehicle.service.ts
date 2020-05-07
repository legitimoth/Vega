import { Vehicle, SaveVehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class vehicleService {

    constructor(private http: HttpClient) { }

    getVehicle(id) {

        return this.http.get('/api/vehicles/' + id)
            .pipe(map(res => res));
    }

    getMakes() {
        return this.http.get('/api/makes')
            .pipe(map(res => res));
    }

    getFeatures() {
        return this.http.get('/api/features')
            .pipe(map(res => res));
    }

    create(vehicle: SaveVehicle){
        return this.http.post('/api/vehicles', vehicle)
            .pipe(map(res => res));
    }

    update(vehicle: SaveVehicle){
        return this.http.put('/api/vehicles/' + vehicle.id, vehicle)
            .pipe(map(res => res));
    }

    delete(id){
        return this.http.delete('/api/vehicles/' + id)
        .pipe(map(res => res));
    }
}
