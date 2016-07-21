import {Component, Input} from '@angular/core';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import {Modal, Platform, NavController, NavParams, ViewController, IONIC_DIRECTIVES, Alert} from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/students-detail-review/students-detail-review.html'
})
export class StudentDetailReviewPage {
    assignment_dict = {};
    chapter_assignments = [];
    assignment_url: string;
    student = 0;
    students_to_review = [];
    reviewed: boolean;

    ans_map: {};
    peers_feedback: {};
    ans1: string;
    ans2: string;
    ans3: string;

    feedback: any;
    assignmentUrl: string; url: SafeResourceUrl;
    peerIndex: number;
    questions = [];
    peer: string;
    reviewer: string;
    assignment: string;

    constructor(private nav: NavController, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private dataService: Data, private lib: Lib, private sanitizer: DomSanitizationService) {
        this.feedback = this.params.get('feedback');
        console.log(this.feedback);
        this.assignmentUrl = this.params.get('assignmentUrl');
        console.log(this.assignmentUrl);
        this.peerIndex = this.params.get('peerIndex');
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assignmentUrl);//WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
        console.log(this.url);
        this.peer = this.params.get('peer');
        this.reviewer = this.params.get('reviewer');
        this.assignment = this.params.get('assignment');
    }

    submitReview() {
        var obj = this;
        this.reviewed = true;
        this.dataService.submitPeerFeedback(this.assignment, this.reviewer, this.peer, this.feedback).then(function(response) {
            if (response["ok"] == true) {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Succesfully Submitted Review");
                obj.nav.present(toastmsg);
            } else {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to submit review, Try Again");
                obj.nav.present(toastmsg);
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
