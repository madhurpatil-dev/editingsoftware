import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  darkMode: boolean = false;

  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
  }

// layout.component.ts
toggleDarkMode(): void {
  this.isDarkMode = !this.isDarkMode;
  const body = document.body;
  if (this.isDarkMode) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  }
}


  applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
