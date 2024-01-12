import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private _darkTheme: Subject<boolean> = new Subject<boolean>();
    isDarkTheme = this._darkTheme.asObservable();
  

    constructor(@Inject(DOCUMENT) private document: Document) {}

    switchPrimengTheme(theme: string) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

        if (themeLink) {
            console.log("Applying theme:", theme);
            themeLink.href = theme + '.css';
        }
    }

    setMaterialDarkTheme(isDarkTheme: boolean) {
        this._darkTheme.next(isDarkTheme);
      }
}