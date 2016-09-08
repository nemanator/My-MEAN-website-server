import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'cv-page',
  templateUrl: 'cv.html'
})
export default class CvComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'CV',
      strapline: ''
    };
  }
}
