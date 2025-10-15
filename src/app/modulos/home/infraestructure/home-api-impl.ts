import { Injectable } from "@angular/core";
import { ApiService } from "../../shared/infraestructure/services/api/api.service";
import { ResponseApi } from "../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { HomeGateway } from "../domain/gateway/home-gateway";
import { GameMap } from "../../shared/domain/models/gameMap";
import { MovementAddedRequest } from "../../shared/domain/request/movementAddedRequest";

@Injectable({
    providedIn: 'root'
})
export class HomeUserApiImpl extends HomeGateway {
    constructor(private apiService: ApiService){ super()}

    getMapLevel(gameMap: GameMap) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/getMapLevel`, gameMap);
    }

    getTotalMaps() : Observable<ResponseApi> {
        return this.apiService.get<ResponseApi>(`gamemapkoban/getTotalMaps`);
    }
    
    getRecordKoban() : Observable<ResponseApi> {
        return this.apiService.get<ResponseApi>(`gamemapkoban/getRecordKoban`);
    }

    getTimeGame() : Observable<ResponseApi> {
        return this.apiService.get<ResponseApi>(`gamemapkoban/getTimeGame`);
    }

    movementAdded(movementAdd: MovementAddedRequest) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/movementAdded`, movementAdd);
    }

    recordKoban(movementAdd: MovementAddedRequest) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/recordKoban`, movementAdd);
    }

    finishLevel(movementAdd: MovementAddedRequest) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/finishLevel`, movementAdd);
    }

    resetMovements(movementAdd: MovementAddedRequest) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/resetMovements`, movementAdd);
    }

    resetLevelComplete(movementAdd: MovementAddedRequest) : Observable<ResponseApi> {
        return this.apiService.post<ResponseApi>(`gamemapkoban/resetLevelComplete`, movementAdd);
    }
}
