import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {StudentAssignment} from '../student-assignment/student-assignment';
import {Data} from '../../providers/data/data';

@Component({
  templateUrl: 'build/pages/assignment-reviewed/assignment-reviewed.html',
  directives: [StudentAssignment]
})
export class AssignmentReviewedPage {
  title: string;
  teacher_reviewed: any;
  responses: any;
  constructor(public nav: NavController, navParams:NavParams, private dataService:Data) {
    this.title = navParams.get('title');
  }

  ionViewWillEnter(){
    this.dataService.getAssignmentInfo(this.title).then((assignment_info) => {
        if (assignment_info) {
            this.teacher_reviewed                = assignment_info["teacher_reviewed"];
            this.responses                       = assignment_info["responses"];
        }
    })
  }
}
