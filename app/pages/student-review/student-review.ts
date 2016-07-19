import {Component, Input} from '@angular/core';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {Modal, Platform, NavController, NavParams, ViewController, IONIC_DIRECTIVES, Alert} from 'ionic-angular';
import {StudentDetailReviewPage} from '../students-detail-review/students-detail-review';


@Component({
    templateUrl: 'build/pages/student-review/student-review.html',
    selector: 'student-review',
    directives: [IONIC_DIRECTIVES]
})
export class StudentReviewPage {
    @Input() assignment: string;
    @Input() response: {};
    @Input() email: string;
    @Input() studentGrade: string;
    @Input() classSelected: string;
    @Input() chapterSelected: string;

    assignment_dict = {};
    chapter_assignments = [];
    assignment_url: string;
    cumulative_rating;
    students_to_review = [];
    student: string;

    constructor(public nav: NavController, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private dataService: Data) {
    }

    ngOnInit() {
        this.dataService.getAssignmentInfo(this.assignment).then((assignmentDetail_info) => {
            if (assignmentDetail_info) {
                this.assignment_dict[this.assignment] = {};
                this.assignment_dict[this.assignment]["peer_review_map"] = assignmentDetail_info["peer_review_map"];
                this.assignment_dict[this.assignment]["responses"] = assignmentDetail_info["responses"];
                console.log(this.assignment_dict);
                this.assignment_url = this.assignment_dict[this.assignment]["responses"][this.email]["attachmentUrl"];
                this.cumulative_rating = this.assignment_dict[this.assignment]["responses"][this.email]["cumulative_rating"];
                this.students_to_review = this.assignment_dict[this.assignment]["peer_review_mapp"][this.email]["to_review"];
                console.log(this.assignment_dict[this.assignment]["peer_review_mapp"][this.email]["to_review"]);
                console.log(this.assignment_dict[this.assignment]["responses"][this.email]["cumulative_rating"]);
            }
        }).catch(function(exception) {
            console.log(exception);
        });
    }

    openModal(studentNum) {
        let modal = Modal.create(StudentDetailReviewPage, studentNum);
        this.nav.present(modal);
    }
}
