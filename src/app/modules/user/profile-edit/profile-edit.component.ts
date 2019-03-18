import { Component, OnInit } from '@angular/core';
import { AuthService, UserService, User, StorageService } from '@app/core';
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
  avatar: File;
  defaultAvatarUrl: string = environment.defaultAvatar;
  currentAvatarUrl: any;
  IMAGES_URL = environment.api_url + '/images/';
  submitting = false;
  generalForm: FormGroup;
  credentialsForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService
    ) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.currentAvatarUrl = this.user.avatarUrl ? this.user.avatarUrl : this.defaultAvatarUrl;
    this.generalForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      avatar: [null],
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
    this.user.aboutMe = this.general.aboutMe.value;
    if (this.avatar) {
      const filename = this.user.username + '-' + this.avatar.name;
      //this.user.avatarUrl = this.IMAGES_URL + filename;
      this.storageService.upload(this.avatar, filename).subscribe(
        data => {
          this.user.avatarUrl = data.fileDownloadUri;
          this.saveUser();
        },
        error => {
          console.log(error);
          this.messageService.add({severity:'error', summary:'Error', detail:'Unable to upload image.'});
        })
    } else if (this.currentAvatarUrl == this.defaultAvatarUrl) {
      this.user.avatarUrl = null;
      this.saveUser();
    }
  }

  private saveUser() {
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
    this.currentAvatarUrl = this.defaultAvatarUrl;
  }

  onSelectFile(files) {
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Please select an image file'});
      return;
    }

    this.avatar = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.avatar); 
    reader.onload = (_event) => { 
      this.currentAvatarUrl = reader.result; 
    }
    this.general.avatar.setValue(this.avatar.name);
  }
}
