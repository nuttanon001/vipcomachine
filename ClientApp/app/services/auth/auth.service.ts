import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    userName: string;
    authKey = "auth";
    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private http: Http) { }

    login(username: string, password: string): Observable<any> {
        let data = {
            UserName: username,
            Password: password
        };

        return this.http.post("api/LoginName/Login", data
            , new RequestOptions({
                headers: new Headers({
                    // for urlencoded
                    //  "Content-Type": "application/x-www-form-urlencoded"
                    "Content-Type": "application/json"
                })
            }))
            .map((response: Response) => {
                let auth = response.json();
                this.setAuth(auth);
                this.isLoggedIn = true;
                this.userName = auth.UserName; //data.UserName;
                return auth;
            });
    }

    logout(): boolean {
        this.setAuth(null);
        this.isLoggedIn = false;
        this.userName = "";
        return false;
    }

    // Converts a Json object to urlencoded format
    toUrlEncodedString(data: any) {
        let body = "";
        for (let key in data) {
            if (body.length) {
                body += "&";
            }
            body += key + "=";
            body += encodeURIComponent(data[key]);
        }
        return body;
    }
    // Persist auth into localStorage or removes it if a NULL argument is given
    setAuth(auth: any): boolean {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        }
        else {
            localStorage.removeItem(this.authKey);
        }
        return true;
    }
    // Retrieves the auth JSON object (or NULL if none)
    getAuth(): any {
        var i = localStorage.getItem(this.authKey);
        if (i) {
            return JSON.parse(i);
        }
        else {
            return null;
        }
    }
}