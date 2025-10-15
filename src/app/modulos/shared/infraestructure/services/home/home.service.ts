import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ResponseApi } from "../../../domain/models/responseApi";
import { ToolsService } from "../tools/tools.service";
import { HomeUserCases } from "../../../../home/domain/usecase/home-usecase";
import { GameMap } from "../../../domain/models/gameMap";
import { MovementAddedRequest } from '../../../../shared/domain/request/movementAddedRequest';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(
        private _homeUseCases: HomeUserCases,
        private toolsService: ToolsService
    ){}

    async getMapLevel(gameMap: GameMap): Promise<string> {
        const res = await lastValueFrom(this._homeUseCases.getMapLevel(gameMap));
        return res.data;
    }

    async getTotalMaps(): Promise<number> {
        const res = await lastValueFrom(this._homeUseCases.getTotalMaps());
        return res.data;
    }

    async getTimeGame(): Promise<string> {
        const res = await lastValueFrom(this._homeUseCases.getTimeGame());
        return res.data;
    }

    async movementAdded(movementAdd: MovementAddedRequest): Promise<any> {
        await lastValueFrom(this._homeUseCases.movementAdded(movementAdd));
    }

    async recordKoban(movementAdd: MovementAddedRequest): Promise<any> {
        await lastValueFrom(this._homeUseCases.recordKoban(movementAdd));
    }
    
    async finishLevel(movementAdd: MovementAddedRequest): Promise<number> {
        const res = await lastValueFrom(this._homeUseCases.finishLevel(movementAdd));
        return res.data;
    }

    async resetMovements(movementAdd: MovementAddedRequest): Promise<any> {
        await lastValueFrom(this._homeUseCases.resetMovements(movementAdd));
    }

    async resetLevelComplete(movementAdd: MovementAddedRequest): Promise<any> {
        await lastValueFrom(this._homeUseCases.resetLevelComplete(movementAdd));
    }
}