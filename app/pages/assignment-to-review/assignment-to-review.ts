import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {StudentAssignment} from '../student-assignment/student-assignment';
import {Data} from '../../providers/data/data';

@Component({
  templateUrl: 'build/pages/assignment-to-review/assignment-to-review.html',
  directives: [StudentAssignment]
})
export class AssignmentToReviewPage {
  title: string;
  teacher_yet_to_review: any;
  responses: any;
  constructor(public nav: NavController, navParams:NavParams, private dataService:Data) {
    this.title = navParams.get('title');
  }
  ionViewWillEnter(){
    this.dataService.getAssignmentInfo(this.title).then((assignment_info) => {
        if (assignment_info) {
            this.teacher_yet_to_review           = assignment_info["teacher_yet_to_review"];
            this.responses                       = assignment_info["responses"];
        }
    })
  }
  getStudentsToBeReviewed(){
    return this.teacher_yet_to_review;
  }
}
