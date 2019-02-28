import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CardService} from '@app/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.css']
})
export class CardEditComponent implements OnInit {
    card: any = {};

    sub: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private cardService: CardService) {
    }

    ngOnInit() {
    }

    gotoList() {
        this.router.navigate(['/card-list']);
    }

    save(form: NgForm) {
        this.cardService.save(form).subscribe(result => {
            this.gotoList();
        }, error => console.error(error));
    }

    remove(href) {
        this.cardService.remove(href).subscribe(result => {
            this.gotoList();
        }, error => console.error(error));
    }
}
