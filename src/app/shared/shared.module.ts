import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  MatGridListModule,
  MatSnackBarModule,
  MatExpansionModule, MatTabsModule, MatTableModule, MatCheckbox, MatCheckboxModule, MatPaginatorModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    AngularDateTimePickerModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class SharedModule {}
