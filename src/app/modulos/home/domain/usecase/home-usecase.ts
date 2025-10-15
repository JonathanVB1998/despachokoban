import { Injectable } from "@angular/core";
import { HomeGateway } from "../gateway/home-gateway";
import { ResponseApi } from "../../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { GameMap } from "../../../shared/domain/models/gameMap";
import { MovementAddedRequest } from "../../../shared/domain/request/movementAddedRequest";
import { GamerRequest } from "../../../shared/domain/request/gamerRequest";

@Injectable({
    providedIn: 'root'
})
export class HomeUserCases{
    constructor(private _homeGateway: HomeGateway){}

    getMapLevel(gameMap: GameMap):Observable<ResponseApi>{
        return this._homeGateway.getMapLevel(gameMap);
    }

    getTotalMaps():Observable<ResponseApi>{
        return this._homeGateway.getTotalMaps();
    }

    getRecordKoban():Observable<ResponseApi>{
        return this._homeGateway.getRecordKoban();
    }

    getTimeGame():Observable<ResponseApi>{
        return this._homeGateway.getTimeGame();
    }

    movementAdded(movementAdd: MovementAddedRequest):Observable<ResponseApi>{
        return this._homeGateway.movementAdded(movementAdd);
    }

    userAdded(movementAdd: GamerRequest):Observable<ResponseApi>{
        return this._homeGateway.userAdded(movementAdd);
    }

    recordKoban(movementAdd: MovementAddedRequest):Observable<ResponseApi>{
        return this._homeGateway.recordKoban(movementAdd);
    }

    finishLevel(movementAdd: MovementAddedRequest):Observable<ResponseApi>{
        return this._homeGateway.finishLevel(movementAdd);
    }

    resetMovements(movementAdd: MovementAddedRequest):Observable<ResponseApi>{
        return this._homeGateway.resetMovements(movementAdd);
    }

    resetLevelComplete(movementAdd: MovementAddedRequest):Observable<ResponseApi>{
        return this._homeGateway.resetLevelComplete(movementAdd);
    }

}