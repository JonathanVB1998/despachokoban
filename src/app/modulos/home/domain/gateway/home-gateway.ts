import { ResponseApi } from "../../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { GameMap } from "../../../shared/domain/models/gameMap";
import { MovementAddedRequest } from "../../../shared/domain/request/movementAddedRequest";
import { GamerRequest } from "../../../shared/domain/request/gamerRequest";

@Injectable({
  providedIn: 'root' // o 'any'
})
export abstract class HomeGateway{
    abstract getMapLevel(gameMap:GameMap): Observable<ResponseApi>;

    abstract getTotalMaps() : Observable<ResponseApi>;

    abstract getRecordKoban() : Observable<ResponseApi>;

    abstract getTimeGame() : Observable<ResponseApi>;

    abstract movementAdded(movementAdd: MovementAddedRequest) : Observable<ResponseApi>;

    abstract userAdded(movementAdd: GamerRequest) : Observable<ResponseApi>;

    abstract recordKoban(movementAdd: MovementAddedRequest) : Observable<ResponseApi>;
    
    abstract finishLevel(movementAdd: MovementAddedRequest) : Observable<ResponseApi>;
    
    abstract resetMovements(movementAdd: MovementAddedRequest) : Observable<ResponseApi>;

    abstract resetLevelComplete(movementAdd: MovementAddedRequest) : Observable<ResponseApi>;
}