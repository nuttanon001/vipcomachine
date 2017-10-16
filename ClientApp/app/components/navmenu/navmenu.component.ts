import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MdMenuTrigger } from "@angular/material";
// service
// unmark this if AuthService complete
import { AuthService } from "../../services/service.index";
// model
import { User } from "../../models/model.index";
@Component({
    selector: "nav-menu",
    templateUrl: "./navmenu.component.html",
    styleUrls: ["../../styles/navmenu.style.scss"],
})
export class NavMenuComponent implements OnInit {
    @ViewChild("mainMenu") mainMenu: MdMenuTrigger;
    @ViewChild("subMenu") subMenu: MdMenuTrigger;

    constructor(
        // unmark this if AuthService complete
        private authService: AuthService,
        private router: Router
    ) { }

    // Propertires
    //=============================================\\
    get GetLevel3(): boolean {
        if (this.authService.getAuth) {
            return (this.authService.getAuth.LevelUser || 0) > 3
        }

        else
            return false;
    }

    get GetLevel2(): boolean {
        if (this.authService.getAuth)
            return (this.authService.getAuth.LevelUser || 0) > 1;
        else
            return false;
    }

    get GetLevel1(): boolean {
        if (this.authService.getAuth)
            return (this.authService.getAuth.LevelUser || 0) > 0;
        else
            return false;
    }

    ngOnInit(): void {
    }

    get showLogin(): boolean {
        //return false;
        // unmark this if AuthService complete
        return !this.authService.isLoggedIn;
    }

    get userName(): string {
        if (this.authService.getAuth) {
            return this.authService.getAuth.NameThai || "";
        }
        return "";
    }

    // On menu close
    //=============================================\\
    menuOnCloseMenu1(): void {
        this.subMenu.closeMenu();
    }

    menuOnCloseMenu2(): void {
        this.mainMenu.closeMenu();
    }

    //=============================================\\
    // On menu open
    //=============================================\\
    menuOnOpenMenu1(): void {
        this.mainMenu.openMenu();
    }

    menuOnOpenMenu2(): void {
        this.subMenu.openMenu();
    }
    //=============================================\\
    onLogOut(): void {
        this.authService.logout();
        this.router.navigate(["home"]);
    }
}
