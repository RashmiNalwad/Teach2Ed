import {Component, Input} from '@angular/core';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {Modal, Platform, NavController, NavParams, ViewController,IONIC_DIRECTIVES,Alert} from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/students-detail-review/students-detail-review.html'
})
export class StudentDetailReviewPage {
    @Input() assignment: string;
    @Input() response: {};
    @Input() email: string;
    @Input() studentGrade:string;
    @Input() classSelected:string;
    @Input() chapterSelected:string;

    assignment_dict = {};
    chapter_assignments = [];
    assignment_url:string;
    student:string;
    students_to_review = [];

    constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController,private dataService: Data) {
      this.student = this.students_to_review[this.params.get('studentNum')];
    }

    ngOnInit(){
      // this.dataService.getAssignments(this.studentGrade+"_"+this.classSelected, this.chapterSelected).then((assignmentsInfo) => {
      //   if (assignmentsInfo) {
      //     this.chapter_assignments = assignmentsInfo["assignments"];
      //         this.assignment_dict[this.assignment] = {};
      //         this.assignment_dict[this.assignment]["responses"] = {};
      //         this.assignment_dict[this.assignment]["peer_review_map"] = {};
      //         this.students_to_review = [];
      //
      //       this.dataService.getAssignmentInfo(this.assignment).then((assignmentDetail_info) => {
      //           if (assignmentDetail_info) {
      //               this.assignment_dict[this.assignment] = {};
      //               this.assignment_dict[this.assignment] ["peer_review_map"] = assignmentDetail_info["peer_review_map"];
      //               this.assignment_dict[this.assignment] ["responses"] = assignmentDetail_info["responses"];
      //               this.assignment_url = this.assignment_dict[this.assignment] ["responses"][this.email]["attachmentUrl"];
      //               this.students_to_review = this.assignment_dict[this.assignment]["peer_review_mapp"][this.email]["to_review"];
      //           }
      //       }).catch(function(exception){
      //         console.log(exception);
      //       });
      //   }
      // });
    }

    dismiss() {
      this.viewCtrl.dismiss();
    }
}
