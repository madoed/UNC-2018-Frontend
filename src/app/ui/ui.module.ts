import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatExpansionModule, 
  MatTabsModule, 
  MatTableModule, 
  MatCheckboxModule,
  MatPaginatorModule
} from '@angular/material';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatGridListModule,
    MatSnackBarModule,
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
    ReactiveFormsModule,
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
    MatGridListModule,
    MatSnackBarModule,
    MatExpansionModule, 
    MatTabsModule, 
    MatTableModule, 
    MatCheckboxModule,
    MatPaginatorModule,
    AngularDateTimePickerModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class UiModule {}
