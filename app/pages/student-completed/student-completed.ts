import {Component, Input} from '@angular/core';
import {Modal, NavController, IONIC_DIRECTIVES} from 'ionic-angular';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import {DetailRatingsModalPage} from '../detail-ratings-modal/detail-ratings-modal';

@Component({
    templateUrl: 'build/pages/student-completed/student-completed.html',
    selector: 'student-completed',
    directives: [IONIC_DIRECTIVES]
})
export class StudentCompletedPage {
    @Input() assignment: string;
    @Input() email: string;
    @Input() assignmentDetail: any;

    url: SafeResourceUrl;
    myresponse: any;
    assignment_url: string;
    cumulative_rating: number;
    teacherFeedback: string;
    teacherRating: number;

    constructor(private nav: NavController, private sanitizer: DomSanitizationService) {

    }

    ngOnInit() {
        this.myresponse = this.assignmentDetail["responses"][this.email];
        //console.log(this.myresponse);
        this.assignment_url = this.myresponse["attachmentUrl"];
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assignment_url);//WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
        this.cumulative_rating = this.myresponse["cumulative_rating"];
        this.teacherFeedback = this.myresponse["teacher_feedback"]["Comment"];
        this.teacherRating = this.myresponse["teacher_feedback"]["Rating on Scale of 5"];

        // this.dataService.getAssignmentInfo(this.assignment).then((assignmentDetail_info) => {
        //     if (assignmentDetail_info) {
        //         this.myresponse = assignmentDetail_info["responses"][this.email];
        //         console.log(this.myresponse);
        //         this.assignment_url = this.myresponse["attachmentUrl"];
        //         this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assignment_url);//WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
        //         this.cumulative_rating = this.myresponse["cumulative_rating"];
        //         this.teacherFeedback = this.myresponse["teacher_feedback"]["Comment"];
        //         this.teacherRating = this.myresponse["teacher_feedback"]["Rating on Scale of 5"];
        //     }
        // }).catch(function(exception) {
        //     console.log(exception);
        // });
    }

    viewRatings() {
      console.log(this.myresponse);
      let modal = Modal.create(DetailRatingsModalPage,
        {"myresponse" : this.myresponse});
      this.nav.present(modal);
    }
}
