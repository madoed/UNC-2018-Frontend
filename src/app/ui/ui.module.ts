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
import {AccordionModule, CalendarModule, PickListModule} from 'primeng/primeng';
import {MenuItem} from 'primeng/api';

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
    AngularDateTimePickerModule,
    AccordionModule,
    CalendarModule,
    PickListModule
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
    AngularDateTimePickerModule,
    AccordionModule,
    CalendarModule,
    PickListModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class UiModule {}
