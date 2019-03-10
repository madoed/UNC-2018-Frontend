import { Component, OnInit } from '@angular/core';
import { AuthService, UserService, User } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { environment } from '@env';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user: User = {} as User;
  defaultAvatar = environment.defaultAvatar;
  currentAvatar: any;
  IMAGES_URL = environment.api_url + '/images/';
  submitting = false;
  generalForm: FormGroup;
  credentialsForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.currentAvatar = this.user.avatarUrl ? this.user.avatarUrl : this.defaultAvatar;
    this.generalForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      avatar: [this.currentAvatar.substr(this.currentAvatar.lastIndexOf('/') + 1)],
      aboutMe: [this.user.aboutMe]
    });
    this.credentialsForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, Validators.required]
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });
  }

  get general() { return this.generalForm.controls; }

  get credentials() { return this.credentialsForm.controls; }

  get password() { return this.passwordForm.controls; }

  onSubmitGeneral() {
    if (this.generalForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Please fill in all the required fields'});
      return;
    }

    this.submitting = true;
    this.user.firstName = this.general.firstName.value;
    this.user.lastName = this.general.lastName.value;
    this.user.avatarUrl = this.general.avatar.value ?
                          this.IMAGES_URL + this.general.avatar.value :
                          null;
    this.user.aboutMe = this.general.aboutMe.value;
    
    this.userService.update(this.user)
      .pipe(first())
      .subscribe(
          data => {
            this.authService.user = data;
            this.submitting = false;
            this.messageService.add({severity:'success', summary:'Success', detail:'Profile successfully edited'});
          },
          error => {
            console.log(error);
            this.submitting = false;
            this.messageService.add({severity:'error', summary:'Error', detail:error});
    });
  }

  onSubmitCredentials() {
    if (this.credentialsForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Please fill in all the required fields'});
      return;
    }

    if (this.user.username == this.credentials.username.value &&
      this.user.email == this.credentials.email.value) {
        this.messageService.add({severity:'success', summary:'Error', detail: 'Profile successfully edited'});
        return;
    }

    this.submitting = true;
    this.user.username = this.credentials.username.value;
    this.user.email = this.credentials.email.value;
    this.userService.update(this.user)
      .pipe(first())
      .subscribe(
          data => {
            this.authService.user = data;
            this.submitting = false;
            this.messageService.add({severity:'success', summary:'Success', detail:'Profile successfully edited'});
          },
          error => {
            console.log(error);
            this.submitting = false;
            this.messageService.add({severity:'error', summary:'Error', detail:error});
    });
    this.submitting = false;
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Please fill in all the required fields'});
      return;
    }

    this.submitting = true;
    console.log(this.password.password.value);
  }

  clearAvatar() {
    this.general.avatar.setValue(null);
    this.currentAvatar = this.defaultAvatar;
  }

  onSelectFile(files) {
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Please select an image file'});
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.currentAvatar = reader.result;
      this.general.avatar.setValue(files[0].name); 
    }
  }
}
