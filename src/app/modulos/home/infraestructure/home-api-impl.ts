import { Injectable } from "@angular/core";
import { ApiService } from "../../shared/infraestructure/services/api/api.service";
import { ResponseApi } from "../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { HomeGateway } from "../domain/gateway/home-gateway";
@Injectable({
    providedIn: 'root'
})
export class HomeUserApiImpl extends HomeGateway {
    constructor(private apiService: ApiService){ super()}

    getMapLevel(level: number): Observable<ResponseApi> {
        return this.apiService.get<ResponseApi>(`gamemapkoban/getMapLevel`);
    }
}
