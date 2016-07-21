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
    @Input() email: string;
    @Input() assignmentDetail: any;

    //assignment_dict = {};
    chapter_assignments = [];
    assignment_url: string;
    cumulative_rating;
    peers_to_review = [];
    student = 0;
    questions = [];
    review_by: string;
    s1_status: boolean; //status to decide whether to put create icon or done-all icon.
    s2_status: boolean;
    s3_status: boolean;

    constructor(public nav: NavController, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private dataService: Data) {
    }

    ngOnInit() {
        var dateOptions = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };

        //console.log(this.assignment);
        //console.log(this.assignmentDetail);
        //console.log(this.email);
        if(this.email in this.assignmentDetail["peer_review_map"])
          this.peers_to_review = this.assignmentDetail["peer_review_map"][this.email]["to_review"];
        this.review_by = new Date(this.assignmentDetail["review_peer_deadline_due"]).toLocaleDateString('en-US', dateOptions);
    }

    peerSubmitted(peer) {
        if (peer in this.assignmentDetail['responses'])
            return true;
        else
            return false;
    }

    peerReviewed(peer) {
        if (peer in this.assignmentDetail['responses']) {
            //console.log(this.assignmentDetail['responses'][peer]['peers_feedback'][this.email]['feedback_submitted']);
            return this.assignmentDetail['responses'][peer]['peers_feedback'][this.email]['feedback_submitted'];
        }
        else
            return false;
    }

    openModal(peer, peerIndex) {
        if (peer in this.assignmentDetail['responses']) {
            let arg = {
                peer: peer,
                reviewer: this.email,
                peerIndex: peerIndex,
                assignmentUrl: this.assignmentDetail['responses'][peer]['attachmentUrl'],
                feedback: this.assignmentDetail['responses'][peer]['peers_feedback'][this.email],
                assignment: this.assignment
            };
            console.log(arg);
            let modal = Modal.create(StudentDetailReviewPage, arg);
            this.nav.present(modal);
        } else {
            console.log("peer hasnt yet submitted response");
        }
    }
}
