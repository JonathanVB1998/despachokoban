import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../../../shared/infraestructure/services/home/home.service';
import { GameMap } from '../../../../shared/domain/models/gameMap';
import { MovementAddedRequest } from '../../../../shared/domain/request/movementAddedRequest';
import { RecordKoban } from '../../../../shared/domain/models/RecordKoban';
import { GamerRequest } from '../../../../shared/domain/request/gamerRequest';
import { Products } from '../../../../shared/domain/models/products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  minutesInput: number = 0;
  display: string = '00:00';
  userId: number = 0;
  score: number = 0;
  private interval: any;

  gameMap: GameMap = { level: 1 };
  movementAdd: MovementAddedRequest = { levelId: 0, userId: 0, minutes: "" };
  bestRecords: RecordKoban[] = [];
  board: string[][] = [];
  boxIds: number[][] = []; // IDs de cajas para mantener imágenes
  products: Products[] = [];
  totalLevel: number = 0;
  gamer: GamerRequest = { name: "" };
  playerPos = { x: 1, y: 1 };

  movableBoxes = ['O'];
  goals = ['X'];
  goalBoard: string[][] = [];

  boxImages: Map<number, string> = new Map(); // ID de caja -> URL
  nextBoxId = 0;
  usedProducts: Set<string> = new Set(); // evitar repetir productos

  isModalOpen = false;
  playerName: string = '';

  constructor(private _homeService: HomeService) {}

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    let dx = 0, dy = 0;
    switch(event.key) {
      case 'ArrowUp': dy = -1; break;
      case 'ArrowDown': dy = 1; break;
      case 'ArrowLeft': dx = -1; break;
      case 'ArrowRight': dx = 1; break;
    }
    if (dx !== 0 || dy !== 0) this.movePlayer(dx, dy);
  }

  async ngOnInit(): Promise<void> {
    await this.getTotalMaps();
    await this.getMap();
    await this.getRecordKoban();

    if(this.userId == 0) this.openModal();
  }

  async getMap() {
    this.board = [];
    this.playerPos = { x: 1, y: 1 };
    const reservation = await this._homeService.getMapLevel(this.gameMap);
    this.products = await this._homeService.getProducts();

    if(this.gameMap.level == 1){
      await this.resetLevelComplete();
      await this.resetMovements();
    }

    this.board = JSON.parse(reservation);

    // recalcular metas
    this.goalBoard = this.board.map(row =>
      row.map(cell => this.goals.includes(cell) ? cell : '')
    );

    // inicializar cajas con IDs y imágenes
    this.initializeBoxImages();
  }

  initializeBoxImages() {
    this.boxImages.clear();
    this.boxIds = this.board.map(row => row.map(() => -1));
    this.nextBoxId = 0;

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === 'O') {
          const id = this.nextBoxId++;
          this.boxIds[y][x] = id;
          this.boxImages.set(id, this.getProductForO());
        }
      }
    }
  }

  getProductForO(): string {
    if (this.products.length === 0) return '';

    const availableProducts = this.products.filter(p => !this.usedProducts.has(p.url));

    if (availableProducts.length === 0) this.usedProducts.clear();

    const productList = this.products.filter(p => !this.usedProducts.has(p.url));
    const randomIndex = Math.floor(Math.random() * productList.length);
    const product = productList[randomIndex];
    this.usedProducts.add(product.url);

    return product.url;
  }

  getBoxImage(id: number): string {
    return this.boxImages.get(id) || '';
  }

  movePlayer(dx: number, dy: number) {
    if(this.userId == 0){
      this.openModal();
      return;
    }

    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;

    if(newY < 0 || newY >= this.board.length) return;
    if(newX < 0 || newX >= this.board[0].length) return;

    const nextCell = this.board[newY][newX];

    // pared
    if(nextCell === '#') return;

    // mover caja
    if(this.movableBoxes.includes(nextCell)) {
      const boxX = newX + dx;
      const boxY = newY + dy;

      if(boxY < 0 || boxY >= this.board.length) return;
      if(boxX < 0 || boxX >= this.board[0].length) return;

      const boxDest = this.board[boxY][boxX];

      if(boxDest === '.' || this.goals.includes(boxDest)) {
        // mover caja
        const boxId = this.boxIds[newY][newX];
        this.board[boxY][boxX] = nextCell;
        this.board[newY][newX] = this.goalBoard[newY][newX] || '.';
        this.boxIds[boxY][boxX] = boxId;
        this.boxIds[newY][newX] = -1;

        this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
        this.playerPos = { x: newX, y: newY };
        this.board[newY][newX] = 'P';

        this.checkCompletion();
        this.movementAdded();
      }
      return;
    }

    // mover jugador normal
    if(nextCell === '.' || this.goals.includes(nextCell)) {
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = 'P';
      this.checkCompletion();
      this.movementAdded();
    }
  }

  checkCompletion() {
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.goalBoard[y][x] && !this.movableBoxes.includes(this.board[y][x])) {
          return;
        }
      }
    }

    setTimeout(async () => {
      if(this.gameMap.level < this.totalLevel){
        this.gameMap.level++;
        await this.finishLevel();
        await this.getMap();
      } else {
        await this.finishLevel();
        this.display = "00:00";
        await this.recordKoban();
        await this.getRecordKoban();
      }
    }, 200);
  }

  async getTotalMaps() { this.totalLevel = await this._homeService.getTotalMaps(); }
  async getRecordKoban() { this.bestRecords = await this._homeService.getRecordKoban(); }
  async movementAdded() {
    this.movementAdd.levelId = this.gameMap.level;
    this.movementAdd.userId = this.userId;
    await this._homeService.movementAdded(this.movementAdd);
  }
  async userAdded() {
    this.userId = await this._homeService.userAdded(this.gamer);
    this.startCountdown();
  }
  async recordKoban() {
    this.movementAdd.userId = this.userId;
    if(this.score > 0) await this._homeService.recordKoban(this.movementAdd);
  }
  async finishLevel() {
    this.movementAdd.levelId = this.gameMap.level;
    this.movementAdd.userId = this.userId;
    this.movementAdd.minutes = this.display;
    this.score += await this._homeService.finishLevel(this.movementAdd);
  }

  async startCountdown() {
    this.minutesInput = Number(await this._homeService.getTimeGame());
    if(this.interval) clearInterval(this.interval);
    if(!this.minutesInput || this.minutesInput <= 0) { alert('Ingresa un número válido'); return; }

    let totalSeconds = this.minutesInput * 60;
    this.updateDisplay(totalSeconds);

    this.interval = setInterval(async () => {
      totalSeconds--;
      if(totalSeconds < 0) {
        clearInterval(this.interval);
        this.display = '¡Tiempo terminado!';
        await this.finishLevel();
        await this.recordKoban();
        await this.getRecordKoban();
        return;
      }
      this.updateDisplay(totalSeconds);
    }, 1000);
  }

  private updateDisplay(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  ngOnDestroy() { if(this.interval) clearInterval(this.interval); }

  async resetMovements() {
    this.movementAdd.levelId = this.gameMap.level;
    this.movementAdd.userId = this.userId;
    await this._homeService.resetMovements(this.movementAdd);
  }

  async resetLevelComplete() {
    this.movementAdd.levelId = this.gameMap.level;
    this.movementAdd.userId = this.userId;
    await this._homeService.resetLevelComplete(this.movementAdd);
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }
  saveScore() {
    if(this.playerName.trim() !== '') {
      this.gamer.name = this.playerName.trim();
      this.userAdded();
      this.closeModal();
    }
  }

  reload() {
    this.gameMap.level = 1;
    this.startCountdown();
    this.getMap();
  }

}
