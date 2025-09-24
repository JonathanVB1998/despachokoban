import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],  // necesario para *ngFor y ngClass
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  board: string[][] = [
    ['#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '#'],
    ['#', '.', 'B', '.', '#'],
    ['#', '.', '.', 'G', '#'],
    ['#', '.', '.', '.', '#'],
    ['#', '#', '#', '#', '#']
  ];

  // Guardamos dónde están las metas originales
  goalBoard: boolean[][] = this.board.map(row => row.map(cell => cell === 'G'));

  playerPos = { x: 1, y: 1 };

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const key = event.key;
    let dx = 0, dy = 0;

    if (key === 'ArrowUp') dy = -1;
    if (key === 'ArrowDown') dy = 1;
    if (key === 'ArrowLeft') dx = -1;
    if (key === 'ArrowRight') dx = 1;

    if (dx !== 0 || dy !== 0) {
      this.movePlayer(dx, dy);
    }
  }

  movePlayer(dx: number, dy: number) {
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;

    if (newY < 0 || newY >= this.board.length) return;
    if (newX < 0 || newX >= this.board[0].length) return;

    const nextCell = this.board[newY][newX];
    const currentCell = this.board[this.playerPos.y][this.playerPos.x];

    if (nextCell === '#') return;

    // Empujar caja
    if (nextCell === 'B' || nextCell === 'X') {
      const boxX = newX + dx;
      const boxY = newY + dy;

      if (boxY < 0 || boxY >= this.board.length) return;
      if (boxX < 0 || boxX >= this.board[0].length) return;

      const boxDest = this.board[boxY][boxX];

      if (boxDest === '.' || boxDest === 'G') {
        this.board[boxY][boxX] = this.goalBoard[boxY][boxX] ? 'B' : 'B';
      } else {
        return;
      }

      // Restaurar celda anterior de la caja
      this.board[newY][newX] = this.goalBoard[newY][newX] ? 'G' : '.';

      // Restaurar celda anterior del jugador
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] ? 'G' : '.';

      // Mover jugador
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = this.goalBoard[newY][newX] ? 'P' : 'P';
      return;
    }

    // Mover jugador a celda libre u objetivo
    if (nextCell === '.' || nextCell === 'G') {
      this.board[this.playerPos.y][this.playerPos.x] = this.goalBoard[this.playerPos.y][this.playerPos.x] ? 'G' : '.';
      this.playerPos = { x: newX, y: newY };
      this.board[newY][newX] = this.goalBoard[newY][newX] ? 'P' : 'P';
    }
  }
}

