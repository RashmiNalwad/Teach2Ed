import {Component} from '@angular/core';
import {Loading, NavController, NavParams, Alert} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {AssignmentToReviewPage} from '../assignment-to-review/assignment-to-review';
import {AssignmentReviewedPage} from '../assignment-reviewed/assignment-reviewed';

import {UploadVideoPage} from '../upload-video/upload-video';//time being

@Component({
    templateUrl: 'build/pages/chapter-page/chapter-page.html',
})
export class ChapterPage {
    className: string;
    chapter: string;
    assignments = [];
    assignment_dict = {};
    time: Date;
    futureTime: Date;
    minYear: string;
    maxYear: string;
    isLoading: boolean;
    loading: any;
    constructor(public nav: NavController, navParams: NavParams, private dataService: Data, private lib: Lib) {
        this.loading = Loading.create({
            content: 'Fetching Assignments...'
        });
        this.className = navParams.get('className');
        this.chapter = navParams.get('chapter');
        this.assignments = navParams.get('assignments');
        this.time = new Date();
        this.futureTime = new Date(this.time.getFullYear() + 1, this.time.getMonth(), this.time.getDate());
        this.minYear = this.time.toISOString();
        this.maxYear = this.futureTime.toISOString();
        for (let assignment of this.assignments) {
            this.assignment_dict[assignment] = {};
            this.assignment_dict[assignment]["description"] = "default";
            this.assignment_dict[assignment]["max_response_duration_min"] = 0;
            this.assignment_dict[assignment]["assigned_on"] = "default";
            this.assignment_dict[assignment]["soft_deadline_due"] = "default";
            this.assignment_dict[assignment]["hard_deadline_due"] = "default";
            this.assignment_dict[assignment]["teacher_reviewed"] = [];
            this.assignment_dict[assignment]["no_of_assignments_reviewed"] = 0;
            this.assignment_dict[assignment]["teacher_yet_to_review"] = [];
            this.assignment_dict[assignment]["no_of_assignments_to_review"] = 0;
        }
    }

    ionViewWillEnter() {
        this.nav.present(this.loading);
        this.dataService.getAssignments(this.className, this.chapter).then((assignmentsInfo) => {
            if (assignmentsInfo) {
                this.assignments = assignmentsInfo["assignments"];
                for (let assignment of this.assignments) {
                    this.assignment_dict[assignment] = {};
                    this.assignment_dict[assignment]["description"] = "default";
                    this.assignment_dict[assignment]["max_response_duration_min"] = 0;
                    this.assignment_dict[assignment]["assigned_on"] = "default";
                    this.assignment_dict[assignment]["soft_deadline_due"] = "default";
                    this.assignment_dict[assignment]["hard_deadline_due"] = "default";
                    this.assignment_dict[assignment]["teacher_reviewed"] = [];
                    this.assignment_dict[assignment]["no_of_assignments_reviewed"] = 0;
                    this.assignment_dict[assignment]["teacher_yet_to_review"] = [];
                    this.assignment_dict[assignment]["no_of_assignments_to_review"] = 0;
                }
                var listOfPromises = [];
                for (let assignment of this.assignments) {
                    listOfPromises.push(this.dataService.getAssignmentInfo(assignment));
                }
                Promise.all(listOfPromises).then(values => {
                    //console.log(values);
                    for (let result of values) {
                        //console.log(result);
                        let title = result['_id'].replace("assignment_", "");
                        this.assignment_dict[title] = {};
                        this.assignment_dict[title]["description"] = result["description"];
                        this.assignment_dict[title]["max_response_duration_min"] = result["max_response_duration_min"];
                        this.assignment_dict[title]["assigned_on"] = result["assigned_on"];
                        this.assignment_dict[title]["soft_deadline_due"] = result["soft_deadline_due"];
                        this.assignment_dict[title]["hard_deadline_due"] = result["hard_deadline_due"];
                        this.assignment_dict[title]["teacher_reviewed"] = result["teacher_reviewed"];
                        this.assignment_dict[title]["teacher_yet_to_review"] = result["teacher_yet_to_review"];
                        this.assignment_dict[title]["no_of_assignments_reviewed"] = result["teacher_reviewed"].length;
                        this.assignment_dict[title]["no_of_assignments_to_review"] = result["teacher_yet_to_review"].length;
                    }
                    this.loading.dismiss();
                });
            }
        });

        /*for(let assignment of this.assignments){
          this.dataService.getAssignmentInfo(assignment).then((assignment_info) => {
              if (assignment_info) {
                  this.assignment_dict[assignment] = {};
                  this.assignment_dict[assignment] ["description"] = assignment_info["description"];
                  this.assignment_dict[assignment] ["max_response_duration_min"] = assignment_info["max_response_duration_min"];
                  this.assignment_dict[assignment] ["assigned_on"] = assignment_info["assigned_on"];
                  this.assignment_dict[assignment] ["soft_deadline_due"] = assignment_info["soft_deadline_due"];
                  this.assignment_dict[assignment] ["hard_deadline_due"] = assignment_info["hard_deadline_due"];
                  this.assignment_dict[assignment] ["teacher_reviewed"] = assignment_info["teacher_reviewed"];
                  this.assignment_dict[assignment] ["teacher_yet_to_review"] = assignment_info["teacher_yet_to_review"];
                  this.assignment_dict[assignment] ["no_of_assignments_reviewed"] = assignment_info["teacher_reviewed"].length;
                  this.assignment_dict[assignment] ["no_of_assignments_to_review"] = assignment_info["teacher_yet_to_review"].length;
                  //console.log(this.assignment_dict);
              }
          }).catch(function(exception){
            console.log(exception);
          });
      }*/

    }
    viewDescription() {

    }

    addAssignment() {
        let prompt = Alert.create({
            title: 'New Assignment',
            inputs: [
                { name: 'assignment', placeholder: 'Title' },
                { name: 'description', placeholder: 'Description' },
                { name: 'duration', placeholder: 'Duration in minutes', type: 'number' },
                { name: 'softDeadline', placeholder: 'No of days for Soft deadline', type: 'number' },
                { name: 'hardDeadline', placeholder: 'No of days for Hard deadline', type: 'number' },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        let assignment = data.assignment.toUpperCase();
                        var obj = this;
                        var assignedOnDate = new Date();
                        var softDeadlineDate = new Date(assignedOnDate.getFullYear(), assignedOnDate.getMonth(), assignedOnDate.getDate() + parseInt(data.softDeadline) + 1); //+1 for 0-based index
                        var hardDeadlineDate = new Date(assignedOnDate.getFullYear(), assignedOnDate.getMonth(), assignedOnDate.getDate() + parseInt(data.hardDeadline) + 1);
                        var assignedOnDateString = assignedOnDate.toISOString();
                        var softDeadlineDateString = softDeadlineDate.toISOString();
                        var hardDeadlineDateString = hardDeadlineDate.toISOString();
                        obj.dataService.addAssignment(assignment, obj.className, obj.chapter, data.description, data.duration, assignedOnDateString, softDeadlineDateString, hardDeadlineDateString).then(function(response) {
                            if (response["ok"] == true) {
                                obj.assignments.push(assignment);
                                obj.assignment_dict[assignment] = {};
                                obj.assignment_dict[assignment]["description"] = data.description;
                                obj.assignment_dict[assignment]["max_response_duration_min"] = data.duration;
                                obj.assignment_dict[assignment]["assigned_on"] = assignedOnDateString;
                                obj.assignment_dict[assignment]["soft_deadline_due"] = softDeadlineDateString;
                                obj.assignment_dict[assignment]["hard_deadline_due"] = hardDeadlineDateString;
                                obj.assignment_dict[assignment]["teacher_reviewed"] = [];
                                obj.assignment_dict[assignment]["no_of_assignments_reviewed"] = 0;
                                obj.assignment_dict[assignment]["teacher_yet_to_review"] = [];
                                obj.assignment_dict[assignment]["no_of_assignments_to_review"] = 0;
                            } else {
                                let toastmsg = obj.lib.showToastMsgWithCloseButton("unable to add assignment : " + assignment);
                                obj.nav.present(toastmsg);
                            }
                        });
                    }
                }
            ]
        });
        this.nav.present(prompt);
    }

    deadlineUpdate(assignment) {
        var obj = this;
        this.dataService.deadlineUpdate(assignment, this.assignment_dict[assignment]["soft_deadline_due"], this.assignment_dict[assignment]["hard_deadline_due"]).then(function(response) {
            if (response["ok"] != true) {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to update deadline !!! ");
                obj.nav.present(toastmsg);
            }
        });
    }

    reviewAssignment(event, assignmentTitle) {
        this.nav.push(AssignmentToReviewPage, { 'title': assignmentTitle });
    }
    viewReviews(event, assignmentTitle) {
        this.nav.push(AssignmentReviewedPage, { 'title': assignmentTitle });
    }

    uploadAssignment(assignmentTitle, assignmentDesc) {
        this.nav.push(UploadVideoPage, { 'AssignmentTitle': assignmentTitle, 'AssignmentDescription': assignmentDesc });
    }
}
