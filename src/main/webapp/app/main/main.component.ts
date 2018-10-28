import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Http} from "@angular/http";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit{
    response: string = "Loading...";

    constructor(@Inject(Http) private http: Http) {}

    ngOnInit() {
        this.getHelloMessage()
            .subscribe(
                (data) => {
                    console.log("response", data);
                    this.response = data._body;
                },
                (err) => console.log(err),
                () => console.log());
    }

    getHelloMessage(): Observable<any> {
        return this.http.get('api/hello/');
    }

}
