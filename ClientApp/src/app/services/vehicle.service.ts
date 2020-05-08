import { Vehicle, SaveVehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class vehicleService {

    private readonly vehiclesEndpoint = '/api/vehicles';

    constructor(private http: HttpClient) { }

    getVehicle(id) {

        return this.http.get(this.vehiclesEndpoint + '/' + id)
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

    create(vehicle: SaveVehicle) {
        return this.http.post(this.vehiclesEndpoint, vehicle)
            .pipe(map(res => res));
    }

    update(vehicle: SaveVehicle) {
        return this.http.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle)
            .pipe(map(res => res));
    }

    delete(id) {
        return this.http.delete(this.vehiclesEndpoint + '/' + id)
            .pipe(map(res => res));
    }

    getVehicles(filter) {
        return this.http.get(this.vehiclesEndpoint + '?' + this.toQueryString(filter))
            .pipe(map(res => res));
    }

    toQueryString(obj){
        var parts = [];

        for (var property in obj) {
            var value = obj[property];
            if(value != null && value != undefined)
                parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
        }

        return parts.join('&');
    }
}
