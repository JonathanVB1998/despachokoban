import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../../shared/infraestructure/services/home/home.service';
import { GameMap } from '../../../../shared/domain/models/gameMap';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 
  constructor(
    private _homeService: HomeService
  ){}
  gameMap: GameMap = { level: 1};

  board: string[][] = [];
  board2: string[][] = [ ['#', '#', '#', '#', '#', '#', '#', '#'], ['#', 'P', '.', '.', '.', '.', '.', '#'], ['#', '.', 'O', 'O', '.', '.', '.', '#'], ['#', '.', '.', '.', 'X', '.', '.', '#'], ['#', '.', '.', '.', 'X', '.', '.', '#'], ['#', '.', '.', '.', '.', '.', '.', '#'], ['#', '#', '#', '#', '#', '#', '#', '#'] ];


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

  if (newY < 0 || newY >= this.board.length) return;
  if (newX < 0 || newX >= this.board[0].length) return;

  const nextCell = this.board[newY][newX];
  const currentCell = this.board[this.playerPos.y][this.playerPos.x];

  if (nextCell === '#') return;

  if (this.movableBoxes.includes(nextCell)) {
    const boxX = newX + dx;
    const boxY = newY + dy;

    if (boxY < 0 || boxY >= this.board.length) return;
    if (boxX < 0 || boxX >= this.board[0].length) return;

    const boxDest = this.board[boxY][boxX];

    if (boxDest === '.' || this.goals.includes(boxDest)) {
      this.board[boxY][boxX] = nextCell;  // mover caja
      this.board[newY][newX] = this.goalBoard[newY][newX] || '.';
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = 'P';
    }
    this.checkCompletion();  // revisar si completó
    return;
  }

  if (nextCell === '.' || this.goals.includes(nextCell)) {
    this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
    this.playerPos = { x: newX, y: newY };
    this.board[newY][newX] = 'P';
    this.checkCompletion();  // revisar si completó
  }
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
    if(this.gameMap.level < 5){
      this.gameMap.level++;
      this.getMap();
    }

  }, 200);// todas las metas tienen caja
}
 async ngOnInit(): Promise<void>{
  this.getMap();
 }

async getMap() {
  this.board = [];
  this.playerPos = { x: 1, y: 1 };
  const reservation = await this._homeService.getMapLevel(this.gameMap);

  // 👇 Convierte el string a un arreglo bidimensional real
  this.board = JSON.parse(reservation);

   // ✅ recalcular metas en base al nuevo tablero
  this.goalBoard = this.board.map(row =>
    row.map(cell => this.goals.includes(cell) ? cell : '')
  );
}

}
