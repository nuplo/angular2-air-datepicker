import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { AIR_LANGUAGES, AirCalendar, AirLanguage, AirOptions } from './classes';

@Component({
  selector: 'air-datepicker',
  template: `
    <div class="datepicker-inline">
      <ng-container [ngSwitch]="mode">
        <div *ngSwitchCase="'datepicker'"
             datepicker
             [airDate]="airDate"
             [airOptions]="airOptions"
             [airCalendar]="airCalendar"
             [airLanguage]="airLanguage"
             (setDate)="setDate($event)"
             (setMonth)="airCalendar.setMonth($event); airMonthSelect.emit($event);"
             (monthSelection)="mode = 'monthpicker'"
             class="datepicker"></div>

        <div *ngSwitchCase="'monthpicker'"
             monthpicker
             [airCalendar]="airCalendar"
             [airLanguage]="airLanguage"
             (setMonth)="airCalendar.setMonth($event); airMonthSelect.emit($event); mode = 'datepicker';"
             (setYear)="airCalendar.setYear($event); airYearSelect.emit($event);"
             (yearSelection)="mode = 'yearpicker'"
             class="datepicker"></div>

        <div *ngSwitchCase="'yearpicker'"
             yearpicker
             [airCalendar]="airCalendar"
             (setYear)="airCalendar.setYear($event); airYearSelect.emit($event); mode = 'monthpicker';"
             class="datepicker"></div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./angular2-air-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Angular2AirDatepickerComponent implements OnInit {
  @Input() airOptions: AirOptions;
  @Input() airDate: Date;

  @Output() airChange = new EventEmitter<Date>();
  @Output() airMonthSelect = new EventEmitter<number>();
  @Output() airYearSelect = new EventEmitter<number>();

  airLanguage: AirLanguage;
  airCalendar: AirCalendar;
  mode = 'datepicker';

  ngOnInit () {
    this.airOptions = new AirOptions(this.airOptions || {} as AirOptions);
    this.airLanguage = AIR_LANGUAGES.get(this.airOptions.language);
    this.airCalendar = new AirCalendar(this.airDate, this.airOptions);
  }

  setDate (index?: number) {
    if (this.airCalendar.airDays[index]) {
      if (this.airCalendar.airDays[index].disabled) {
        return;
      }

      this.airCalendar.selectDate(index);
    }

    const time = Date.UTC(this.airCalendar.year, this.airCalendar.month, this.airCalendar.date, this.airCalendar.hour, this.airCalendar.minute);
    if (!this.airOptions.isDisabled(new Date(time))) {
      this.airDate.setTime(time);
      this.airChange.emit(this.airDate);
    }
  }
}
