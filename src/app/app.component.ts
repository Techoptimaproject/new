import { Component, ViewChild,ViewEncapsulation } from '@angular/core';
// import { ThemeService } from './core/themes/theme.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, delay, filter } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';

// TODO: add destroyed$
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class AppComponent {
  title = 'FSProvderPortal';
  hidenavlist:boolean=false;
  hidenavlistclaim=false;
  reportsub=false;
  sidenavcol:boolean=true;
  isActive=true;

  isSelected: boolean = false;
  isselectedClames: boolean = false;
  isSelectedReports:boolean=false
 
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;  
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  // isDarkTheme: Observable<boolean>;

  constructor(
    // private themeService: ThemeService,
    private observer: BreakpointObserver,
    private router: Router
   
  ) {
    // this.isDarkTheme = this.themeService.isDarkTheme;
  }

  ngOnInit() {}

 
 toggleSelection() {
    this.isSelected = !this.isSelected;
  }
  toggleSelectionClimes() {
    this.isselectedClames = !this.isselectedClames;
  }
  toggleSelectionReports(){
    this.isSelectedReports=!this.isSelectedReports;
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  changeTheme(theme: string) {
    // this.themeService.switchPrimengTheme(theme);
  }

  toggleDarkTheme(checked: boolean) {
    // this.themeService.setMaterialDarkTheme(checked);
  }

  toggleMenu() {

    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }

   
  }

  hidesidenav(){


  // this.sidenavcol= !this.sidenavcol
      }

      hidenav() {
        this.hidenavlist = !this.hidenavlist;
        this.isSelected = !this.isSelected;
     
      }
     
      hidenavclaim() {
        this.hidenavlistclaim = !this.hidenavlistclaim;
        this.isselectedClames = !this.isselectedClames;
      }
     
      hidenavreport() {
        console.log('report');
        this.reportsub = !this.reportsub;
        this.isSelectedReports=!this.isSelectedReports;
       
      }


}
