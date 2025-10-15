import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../../shared/infraestructure/services/home/home.service';
import { GameMap } from '../../../../shared/domain/models/gameMap';
import { FormsModule } from '@angular/forms';
import { MovementAddedRequest } from '../../../../shared/domain/request/movementAddedRequest';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  minutesInput: number = 0; // Lo que ingresará el usuario
  display: string = '00:00'; // Lo que se muestra
  userId: number = 1;
  private interval: any;

  constructor(
    private _homeService: HomeService
  ){}
  gameMap: GameMap = { level: 1};
  movementAdd: MovementAddedRequest = {levelId: 0, userId: 0, minutes: ""}

  board: string[][] = [];
  totalLevel: number = 0;

  playerPos = { x: 1, y: 1 };

  movableBoxes = ['O'];  // todas las cajas movibles
  goals = ['X'];         // todas las metas

  // Guardamos las metas para restaurarlas cuando la caja o jugador se mueva
  goalBoard: string[][] = [];

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

movePlayer(dx: number, dy: number) {
  const newX = this.playerPos.x + dx;
  const newY = this.playerPos.y + dy;

  // Verificar límites del tablero
  if (newY < 0 || newY >= this.board.length) return;
  if (newX < 0 || newX >= this.board[0].length) return;

  const nextCell = this.board[newY][newX];

  // Pared
  if (nextCell === '#') return;

  // Movimiento con caja
  if (this.movableBoxes.includes(nextCell)) {
    const boxX = newX + dx;
    const boxY = newY + dy;

    if (boxY < 0 || boxY >= this.board.length) return;
    if (boxX < 0 || boxX >= this.board[0].length) return;

    const boxDest = this.board[boxY][boxX];

    if (boxDest === '.' || this.goals.includes(boxDest)) {
      // Mover caja
      this.board[boxY][boxX] = nextCell;
      this.board[newY][newX] = this.goalBoard[newY][newX] || '.';
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = 'P';
      this.checkCompletion();

      this.movementAdded();
    }
    return;
  }

  // Movimiento normal
  if (nextCell === '.' || this.goals.includes(nextCell)) {
    this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
    this.playerPos = { x: newX, y: newY };
    this.board[newY][newX] = 'P';
    this.checkCompletion();

    this.movementAdded();
  }

  // Si no se mueve, no imprime nada
}


// Función para revisar si todas las metas tienen caja encima
checkCompletion() {
  for (let y = 0; y < this.board.length; y++) {
    for (let x = 0; x < this.board[y].length; x++) {
      if (this.goalBoard[y][x] && !this.movableBoxes.includes(this.board[y][x])) {
        return; // aún hay meta vacía, no completado
      }
    }
  }
   setTimeout(() => {
    
    if(this.gameMap.level < this.totalLevel){
      this.gameMap.level++;
      this.finishLevel();
      this.getMap();
    } else{
      console.log("Finalizo el Juego, felicidades");
    }

  }, 200);// todas las metas tienen caja
}
 async ngOnInit(): Promise<void>{
  this.getTotalMaps();
  this.getMap();
  this.startCountdown();
 }

async getMap() {
  this.board = [];
  this.playerPos = { x: 1, y: 1 };
  const reservation = await this._homeService.getMapLevel(this.gameMap);

  if(this.gameMap.level == 1)
    this.resetMovements();
  
  // 👇 Convierte el string a un arreglo bidimensional real
  this.board = JSON.parse(reservation);

   // ✅ recalcular metas en base al nuevo tablero
  this.goalBoard = this.board.map(row =>
    row.map(cell => this.goals.includes(cell) ? cell : '')
  );
}

async getTotalMaps() {
  this.totalLevel = await this._homeService.getTotalMaps();
}

async movementAdded(){
  this.movementAdd.levelId = this.gameMap.level;
  this.movementAdd.userId = this.userId;

  await this._homeService.movementAdded(this.movementAdd);
}

async finishLevel(){
  this.movementAdd.levelId = this.gameMap.level;
  this.movementAdd.userId = this.userId;
  this.movementAdd.minutes = this.display;

  await this._homeService.finishLevel(this.movementAdd);
}

async startCountdown() {
  this.minutesInput = Number(await this._homeService.getTimeGame());
    // Cancelar cualquier intervalo anterior
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (!this.minutesInput || this.minutesInput <= 0) {
      alert('Ingresa un número válido de minutos');
      return;
    }

    let totalSeconds = this.minutesInput * 60;
    this.updateDisplay(totalSeconds);

    this.interval = setInterval(() => {
      totalSeconds--;
      if (totalSeconds < 0) {
        clearInterval(this.interval);
        this.display = '¡Tiempo terminado!';
        return;
      }
      this.updateDisplay(totalSeconds);
    }, 1000);
  }

  private updateDisplay(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async resetMovements(){
    this.movementAdd.levelId = this.gameMap.level;
    this.movementAdd.userId = this.userId;

    await this._homeService.resetMovements(this.movementAdd);
  }
}
