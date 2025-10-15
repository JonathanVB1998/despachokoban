import { Injectable } from "@angular/core";
import { HomeGateway } from "../gateway/home-gateway";
import { ResponseApi } from "../../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { GameMap } from "../../../shared/domain/models/gameMap";

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

    getTimeGame():Observable<ResponseApi>{
        return this._homeGateway.getTimeGame();
    }

}