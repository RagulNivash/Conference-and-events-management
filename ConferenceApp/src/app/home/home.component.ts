import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  ConferenceAPIUrl: string = environment.ConferenceAPIUrl;
  conferences: Array<Conference> = [];
  selectedConference: Conference;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  registeredConferences: Array<any>;
  data: ConferenceEvent[] = [];
  sortedData: ConferenceEvent[] = [];
  displayedColumns: string[] = ['name', 'speaker', 'startTime', 'endTime', 'room'];
  dataSource: any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private http: HttpClient,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    if(!this.auth.userid)
      this.router.navigate(['login']);
    this.loadRegistrations();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  loadRegistrations(): void {
    this.http.get(this.ConferenceAPIUrl + 'registrations/' + this.auth.userid).subscribe((response: Array<any>) => {
      console.log(response);
      this.registeredConferences = response;
      this.loadPage();
    }, error => {
      console.log(error);
    });
  }

  loadPage(): void {
    this.http.get(this.ConferenceAPIUrl + 'conferences').subscribe((response: Array<Conference>) => {
      console.log(response);
      response.forEach(r => {
        let conference: Conference = r;
        conference.isRegistered = false;
        this.registeredConferences.forEach(rc => {
          if(rc.conferenceid == conference._id)
            conference.isRegistered = true;
        });
        this.conferences.push(conference);
      });
    }, error => {
      console.log(error);
    });
  }

  registerConference(conferenceId: string, conference: Conference): void {
    this.http.post(this.ConferenceAPIUrl + 'registrations', { userid: this.auth.userid, conferenceid: conferenceId })
    .subscribe((response: any) => {
      console.log(response);
      this.snackBar.open('Registration successful', '',
        {
          duration: 2000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      conference.isRegistered = true;
      this.selectConference(conference);
    }, error => {
      console.log(error);
      this.snackBar.open('Registration failed', '',
        {
          duration: 3000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    });
  }

  selectConference(conference: Conference): void {
    if(!conference.isRegistered){
      this.snackBar.open('Register to view event details', '',
        {
          duration: 2000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      return;
    }
    this.selectedConference = conference;
    this.data = [];
    this.data = this.selectedConference.events;
    this.dataSource = new MatTableDataSource(this.data);
  }

  sortData(sort: Sort) {
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'startTime':
          return this.compare(a.startTime, b.startTime, isAsc);
        case 'endTime':
          return this.compare(a.endTime, b.endTime, isAsc);
        case 'room':
          return this.compare(a.room, b.room, isAsc);
        default:
          return 0;
      }
    });

    this.dataSource = new MatTableDataSource(this.sortedData);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

interface Conference {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  events: Array<ConferenceEvent>;
  isRegistered: boolean;
}

interface ConferenceEvent {
  name: string;
  speaker: string;
  startTime: string;
  endTime: string;
  room: string;
}
