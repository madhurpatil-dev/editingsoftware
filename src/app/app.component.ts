import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit(): void {
    try {
      this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    } catch (error) {
      console.error('Unable to read the saved theme preference.', error);
    }
    this.applyDarkMode();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    try {
      localStorage.setItem('darkMode', String(this.isDarkMode));
    } catch (error) {
      console.error('Unable to save the theme preference.', error);
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
