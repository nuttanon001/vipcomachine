import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
// services
import {
    AuthService, DialogsService,
    ValidationService
} from "../../services/service.index";

// classes
import { IUser } from "../../models/model.index";

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["../../styles/login.style.scss"],
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    user: IUser;

    constructor(
        private authService: AuthService,
        private dialogsService: DialogsService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    // init
    ngOnInit(): void {
        this.user = {
            PassWord : "",
            UserName : ""
        };
        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.loginForm = this.fb.group({
            UserName: [this.user.UserName,
                [
                    Validators.required,
                    Validators.minLength(1),
                ]
            ],
            PassWord: [this.user.PassWord,
                [
                    Validators.required,
                    Validators.minLength(4),
                ]
            ]
        });
    }

    // login
    onLogin(): void {
        this.user = this.loginForm.value;
        let username = this.user.UserName;
        let password = this.user.PassWord;
        this.authService.login(username, password)
            .subscribe((data) => {
                // login successful
                let auth = this.authService.getAuth();
                // no more alert Token
                // alert("Our Token is: " + auth.access_token);
                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : "/home";
                this.router.navigate([redirect]);
            },
            (err) => {
                console.log(err);
                // login failure
                this.dialogsService.error("Login failure", "Warning : Username or Password mismatch !!!", this.viewContainerRef)
            });
    }

    // logout
    logout(): void {
        this.authService.logout();
    }
}