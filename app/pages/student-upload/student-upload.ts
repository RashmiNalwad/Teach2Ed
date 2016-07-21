import {Page, Alert, Toast, Loading} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {Component} from '@angular/core';
import {Modal, Platform, NavController, NavParams, ViewController} from 'ionic-angular';
import {StudentCompletedPage} from '../student-completed/student-completed';
import {StudentReviewPage} from '../student-review/student-review';
import {StudentResubmitPage} from '../student-resubmit/student-resubmit';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import {AssignDescriptionModalPage} from '../assign-description-modal/assign-description-modal';
import {UploadVideoPage} from '../upload-video/upload-video';

@Component({
    templateUrl: 'build/pages/student-upload/student-upload.html',
    directives: [StudentCompletedPage, StudentReviewPage, StudentResubmitPage]
})

export class StudentUploadPage {
    chapterSelected: string;
    assignments: string; //To set default tab as Upload
    assignment_dict = {};
    chapter_assignments = [];
    classSelected: string;
    student_grade: string;
    email: string;
    uploaded_assignments = [];
    canResubmit_assignments = [];
    completed_assignments = [];

    yetToUpload_assignments = [];
    soft_deadline_expired_assignments = [];
    safe_submit_assignments = [];

    loading: any;

    constructor(public nav: NavController, navParams: NavParams,
        private dataService: Data, private lib: Lib, private sanitizer: DomSanitizationService) {
        this.chapterSelected = navParams.data.chapter;
        this.student_grade = navParams.data.studentGrade;
        this.classSelected = navParams.data.class;
        this.assignments = "upload";
        this.email = navParams.data.email;
        this.loading = Loading.create({
            content: 'Fetching Assignments...'
        });
    }

    ionViewWillEnter() {
        this.nav.present(this.loading);
        var dateOptions = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        this.dataService.getAssignments(this.student_grade + "_" + this.classSelected, this.chapterSelected).then((assignmentsInfo) => {
            if (assignmentsInfo) {
                this.chapter_assignments = assignmentsInfo["assignments"];
                for (let assignment of this.chapter_assignments) {//initialization
                    this.assignment_dict[assignment] = {};
                    this.assignment_dict[assignment]["description"] = "default";
                    this.assignment_dict[assignment]["max_response_duration_min"] = 0;
                    this.assignment_dict[assignment]["assigned_on"] = "default";
                    this.assignment_dict[assignment]["soft_deadline_due"] = "default";
                    this.assignment_dict[assignment]["hard_deadline_due"] = "default";
                    this.assignment_dict[assignment]["review_peer_deadline_due"] = "default";
                    this.assignment_dict[assignment]["teacher_reviewed"] = [];
                    this.assignment_dict[assignment]["no_of_assignments_reviewed"] = 0;
                    this.assignment_dict[assignment]["teacher_yet_to_review"] = [];
                    this.assignment_dict[assignment]["no_of_assignments_to_review"] = 0
                    this.assignment_dict[assignment]["peer_review_map"] = {};
                    this.assignment_dict[assignment]["responses"] = {};
                }
                for (let assign of this.chapter_assignments) {
                    this.dataService.getAssignmentInfo(assign).then((assignmentDetail_info) => {
                        if (assignmentDetail_info) {
                            this.assignment_dict[assign] = {};
                            this.assignment_dict[assign]["description"] = assignmentDetail_info["description"];
                            this.assignment_dict[assign]["max_response_duration_min"] = assignmentDetail_info["max_response_duration_min"];
                            this.assignment_dict[assign]["assigned_on"] = assignmentDetail_info["assigned_on"];
                            this.assignment_dict[assign]["soft_deadline_due"] = assignmentDetail_info["soft_deadline_due"];
                            this.assignment_dict[assign]["formatted_soft_deadline_due"] = new Date(this.assignment_dict[assign]["soft_deadline_due"]).toLocaleDateString('en-US', dateOptions);
                            this.assignment_dict[assign]["hard_deadline_due"] = assignmentDetail_info["hard_deadline_due"];
                            this.assignment_dict[assign]["formatted_hard_deadline_due"] = new Date(this.assignment_dict[assign]["hard_deadline_due"]).toLocaleDateString('en-US', dateOptions);
                            this.assignment_dict[assign]["review_peer_deadline_due"] = assignmentDetail_info["review_peer_deadline_due"];
                            this.assignment_dict[assign]["teacher_reviewed"] = assignmentDetail_info["teacher_reviewed"];
                            this.assignment_dict[assign]["teacher_yet_to_review"] = assignmentDetail_info["teacher_yet_to_review"];
                            this.assignment_dict[assign]["no_of_assignments_reviewed"] = assignmentDetail_info["teacher_reviewed"].length;
                            this.assignment_dict[assign]["no_of_assignments_to_review"] = assignmentDetail_info["teacher_yet_to_review"].length;

                            this.assignment_dict[assign]["peer_review_map"] = assignmentDetail_info["peer_review_map"];
                            this.assignment_dict[assign]["responses"] = assignmentDetail_info["responses"];

                            console.log("studentsWhoHaveUploaded : " + assign);
                            let studentsWhoHaveUploaded = Object.keys(this.assignment_dict[assign]["responses"]);
                            console.log(studentsWhoHaveUploaded);
                            if (studentsWhoHaveUploaded.indexOf(this.email) != -1) {//found : student has already uploaded
                                this.uploaded_assignments.push(assign);
                                //console.log("uploaded_assignments : " + this.uploaded_assignments);
                                let currentDate = new Date();
                                let hardDeadlineDate = new Date(this.assignment_dict[assign]["hard_deadline_due"]);
                                if (currentDate <= hardDeadlineDate) {//can resubmit
                                    this.canResubmit_assignments.push(assign);
                                    //console.log("canResubmit_assignments : " + this.canResubmit_assignments);
                                } else {//cannot resubmit
                                    this.completed_assignments.push(assign);
                                    //console.log("completed_assignments : " + this.completed_assignments);
                                }
                            } else {//not_found: student_yet_to_upload
                                this.yetToUpload_assignments.push(assign);
                                //console.log("yetToUpload_assignments : " + this.yetToUpload_assignments);
                                let currentDate = new Date();
                                let softDeadlineDate = new Date(this.assignment_dict[assign]["soft_deadline_due"]);
                                if (currentDate <= softDeadlineDate) {//safe_submit
                                    this.safe_submit_assignments.push(assign);
                                } else {//soft_deadline_expired
                                    this.soft_deadline_expired_assignments.push(assign);
                                }
                            }

                        }
                    }).catch(function(exception) {
                        console.log(exception);
                    });
                }
                this.loading.dismiss();
            }
        });
    }

    uploadAssignment(assignmentTitle, assignmentDesc) {
        this.nav.push(UploadVideoPage, { 'AssignmentTitle': assignmentTitle,
                                         'AssignmentDescription': assignmentDesc,
                                         'student' : this.email,
                                         'assignmentDetail' : this.assignment_dict[assignmentTitle],
                                         'uploaded_assignments'     : this.uploaded_assignments,
                                         'canResubmit_assignments'  : this.canResubmit_assignments,
                                         'completed_assignments'    : this.completed_assignments,
                                         'yetToUpload_assignments'  : this.yetToUpload_assignments,
                                         'soft_deadline_expired_assignments' : this.soft_deadline_expired_assignments,
                                         'safe_submit_assignments'  : this.safe_submit_assignments,
                                         'task' : 'upload'
                                       });
    }

    openModal(assignmentSelected) {
        //console.log("openModal for " + assignmentSelected);
        let modal = Modal.create(AssignDescriptionModalPage,
            {
                description: this.assignment_dict[assignmentSelected]["description"],
                assignment: assignmentSelected,
                max_response_time: this.assignment_dict[assignmentSelected]["max_response_duration_min"],
                assigned_on: this.assignment_dict[assignmentSelected]["assigned_on"],
                edit: false
            });
        this.nav.present(modal);

    }
}
