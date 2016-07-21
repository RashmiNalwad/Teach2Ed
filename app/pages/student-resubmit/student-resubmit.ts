import { Component, Input } from '@angular/core';
import { NavController, IONIC_DIRECTIVES, Modal } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import {AssignDescriptionModalPage} from '../assign-description-modal/assign-description-modal';
import {UploadVideoPage} from '../upload-video/upload-video';
import {DetailRatingsModalPage} from '../detail-ratings-modal/detail-ratings-modal';

@Component({
    templateUrl: 'build/pages/student-resubmit/student-resubmit.html',
    selector: 'student-resubmit',
    directives: [IONIC_DIRECTIVES]
})
export class StudentResubmitPage {
    @Input() assignment: string;
    @Input() email: string;
    @Input() assignmentDetail: any;
    @Input() canResubmit_assignments: any;
    @Input() completed_assignments: any;

    @Input() uploaded_assignments: any;
    @Input() yetToUpload_assignments: any;
    @Input() soft_deadline_expired_assignments: any;
    @Input() safe_submit_assignments: any;

    url: SafeResourceUrl;
    myresponse: any;
    assignment_url: string;
    constructor(private nav: NavController, private sanitizer: DomSanitizationService) {

    }
    ngOnInit() {
        //console.log(this.assignmentDetail);
        this.myresponse = this.assignmentDetail["responses"][this.email];
        //console.log(this.myresponse);
        this.assignment_url = this.myresponse["attachmentUrl"];
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assignment_url);//WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
    }
    resubmitAssignment(assignmentTitle, assignmentDesc) {
        this.nav.push(UploadVideoPage, {
            'AssignmentTitle': assignmentTitle,
            'AssignmentDescription': assignmentDesc,
            'student': this.email,
            'assignmentDetail': this.assignmentDetail,
            'uploaded_assignments': this.uploaded_assignments,
            'canResubmit_assignments': this.canResubmit_assignments,
            'completed_assignments': this.completed_assignments,
            'yetToUpload_assignments': this.yetToUpload_assignments,
            'soft_deadline_expired_assignments': this.soft_deadline_expired_assignments,
            'safe_submit_assignments': this.safe_submit_assignments,
            'task': 'resubmit'
        });
    }
    openModal() {
        let modal = Modal.create(AssignDescriptionModalPage,
            {
                description: this.assignmentDetail["description"],
                assignment: this.assignment,
                max_response_time: this.assignmentDetail["max_response_duration_min"],
                assigned_on: this.assignmentDetail["assigned_on"],
                edit: false
            });
        this.nav.present(modal);

    }
    viewRatings() {
        console.log(this.assignmentDetail["responses"][this.email]);
        let modal = Modal.create(DetailRatingsModalPage,
            { "myresponse": this.assignmentDetail["responses"][this.email] });
        this.nav.present(modal);
    }

}
