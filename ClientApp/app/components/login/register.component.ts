// angular
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// model
import { User } from "../../models/model.index";
// service
import { DialogsService, UserService } from "../../services/service.index";
import { EmployeeService } from "../../services/employee/employee.service";
// timezone
import * as moment from "moment-timezone";

@Component({
    selector: "register",
    templateUrl: "./register.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
    providers: [UserService,EmployeeService]
})
// register component*/
export class RegisterComponent implements OnInit {
    user: User;
    userForm: FormGroup;
    empCode: string = "";
    userName: string = "";
    // register ctor */
    constructor(
        private service: UserService,
        private serviceEmployee: EmployeeService,
        private serviceDialogs: DialogsService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,

    ) { }

    /** Called by Angular after register component initialized */
    ngOnInit(): void {
        this.user = {
            UserId: 0,
            LevelUser: 1,
        };

        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.userForm = this.fb.group({
            UserId: [this.user.UserId],
            UserName: [this.user.UserName,
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(50),
                ]
            ],
            PassWord: [this.user.PassWord,
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20)
                ]
            ],
            MailAddress: [this.user.MailAddress,
                [
                    Validators.maxLength(200),
                ]
            ],
            LevelUser: [this.user.LevelUser],
            EmpCode: [this.user.EmpCode,
                [
                    Validators.required,
                ]
            ],
            Creator: [this.user.Creator],
            CreateDate: [this.user.CreateDate],
            Modifyer: [this.user.Modifyer],
            ModifyDate: [this.user.ModifyDate],
            // viewModel
            NameThai: [this.user.NameThai,
                [
                    Validators.required,
                ]
            ],
        });

        const control: AbstractControl | null = this.userForm.get("EmpCode");
        if (control) {
            control.valueChanges.subscribe((data: any) => this.onUpdateEmployee());
        }
    }

    // update PlanDate
    onUpdateEmployee(): void {
        if (!this.userForm || !this.user) { return; }

        const form = this.userForm;
        const control: AbstractControl | null = form.get("EmpCode");
        // if have planned start date
        if (control) {
            // beark loop
            if (this.empCode) {
                if (this.empCode === control.value) {
                    return;
                }
            }

            // console.log("Loop");

            this.serviceEmployee.getOneKeyString(control.value)
                .subscribe(employee => {
                    this.service.getEmployeeAlready(employee.EmpCode)
                        .subscribe(data => {
                            this.userForm.patchValue({
                                NameThai: employee.NameThai,
                            });
                        }, error => {
                            let message = error.replace("404 - Not Found", "");
                            this.serviceDialogs.error("Reguester Error", (message || ""), this.viewContainerRef);
                            this.userForm.patchValue({
                                NameThai: "",
                            });
                        });
                }, error => {
                    this.userForm.patchValue({
                        NameThai: "",
                    });
                    console.error(error);
                });
        }
    }

    // on valid data
    onSubmit(): void {
        if (this.userForm) {
            this.user = this.userForm.value;

            let zone:string = "Asia/Bangkok";
            if (this.user) {
                if (this.user.CreateDate !== null) {
                    this.user.CreateDate = moment.tz(this.user.CreateDate, zone).toDate();
                }
                if (this.user.ModifyDate !== null) {
                    this.user.ModifyDate = moment.tz(this.user.ModifyDate, zone).toDate();
                }
            }

            this.user.Creator = this.user.UserName;

            this.service.post(this.user)
                .subscribe(dBUser => {
                    this.serviceDialogs.context("Regiester Complate", "บัญชีผู้ใช้งานนี้สามารถเข้าใช้งานได้แล้ว", this.viewContainerRef)
                        .subscribe(() => this.onGoBack());
                }, (error: string) => {
                    let message = error.replace("404 - Not Found", "");

                    this.serviceDialogs.error("Reguester Error", (message || ""), this.viewContainerRef);
                });
        }
    }

    // on go back
    onGoBack(): void {
        this.router.navigate(["login"]);
    }
}