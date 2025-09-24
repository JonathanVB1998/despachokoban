import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  board: string[][] = [
    ['#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '#'],
    ['#', '.', 'O', 'O', '#'],
    ['#', '.', '.', 'X', '#'],
    ['#', '.', '.', 'X', '#'],
    ['#', '#', '#', '#', '#']
  ];

  playerPos = { x: 1, y: 1 };

  movableBoxes = ['O'];  // todas las cajas movibles
  goals = ['X'];         // todas las metas

  // Guardamos las metas para restaurarlas cuando la caja o jugador se mueva
  goalBoard: string[][] = this.board.map(row => row.map(cell => this.goals.includes(cell) ? cell : ''));

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

    // Empujar caja si es movible
    if (this.movableBoxes.includes(nextCell)) {
      const boxX = newX + dx;
      const boxY = newY + dy;

      if (boxY < 0 || boxY >= this.board.length) return;
      if (boxX < 0 || boxX >= this.board[0].length) return;

      const boxDest = this.board[boxY][boxX];

      if (boxDest === '.' || this.goals.includes(boxDest)) {
        // Mover la caja sin cambiar su letra
        this.board[boxY][boxX] = nextCell;

        // Restaurar celda anterior de la caja
        this.board[newY][newX] = this.goalBoard[newY][newX] || '.';

        // Restaurar celda anterior del jugador
        this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';

        // Mover jugador
        this.playerPos = { x: newX, y: newY };
        this.board[newY][newX] = 'P';
      }
      return;
    }

    // Mover jugador a celda libre o meta
    if (nextCell === '.' || this.goals.includes(nextCell)) {
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] || '.';
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = 'P';
    }
  }
}
