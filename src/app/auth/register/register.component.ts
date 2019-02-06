import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '@app/core';

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.css'],
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log('Registration successful');
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log(error);
                    this.loading = false;
                });
    }
}
