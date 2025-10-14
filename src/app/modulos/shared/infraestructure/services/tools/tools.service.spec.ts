import { TestBed } from "@angular/core/testing";

import { ApiService } from "../api/api.service";

describe('ToolsService', () => {
    let service: ApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});