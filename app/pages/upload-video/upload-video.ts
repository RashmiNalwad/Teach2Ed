/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {CordovaOauth, Google} from 'ng2-cordova-oauth/core';
import {MediaUploader} from './cors-upload.ts';
import * as $ from 'jquery';

import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';

@Component({
    templateUrl: 'build/pages/upload-video/upload-video.html',
})
export class UploadVideoPage {
    videoTitle: string;
    videoDesc: string;
    videoPrivacy: string;
    student: string;
    assignmentDetail: any;
    uploaded_assignments: any;
    canResubmit_assignments: any;
    completed_assignments: any;

    yetToUpload_assignments: any;
    soft_deadline_expired_assignments: any;
    safe_submit_assignments: any;

    task: string;

    tags: any;
    categoryId: number;
    videoId: string;
    uploadStartTime: number;

    authenticated: boolean;
    accessToken: string;

    loggedIn: boolean;
    duringUpload: boolean;
    postUpload: boolean;

    cordovaOauth: any;
    constructor(public nav: NavController, navParams: NavParams, private platform: Platform,
        private dataService: Data, private lib: Lib) {
        let browser_clientid = "648097626079-8c4rcmnpij2i1ifpbva2k6b8ehk0h4lm.apps.googleusercontent.com";
        let appScope = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"];

        this.videoTitle = navParams.get('AssignmentTitle');
        this.videoDesc = navParams.get('AssignmentDescription');
        this.student = navParams.get('student');
        this.assignmentDetail = navParams.get('assignmentDetail');
        this.uploaded_assignments = navParams.get('uploaded_assignments');
        this.canResubmit_assignments = navParams.get('canResubmit_assignments');
        this.completed_assignments = navParams.get('completed_assignments');
        this.yetToUpload_assignments = navParams.get('yetToUpload_assignments');
        this.soft_deadline_expired_assignments = navParams.get('soft_deadline_expired_assignments');
        this.safe_submit_assignments = navParams.get('safe_submit_assignments');
        this.task = navParams.get('task');


        this.videoPrivacy = "public"; //https://support.google.com/youtube/answer/157177?hl=en

        this.tags = ['youtube-cors-upload'];
        this.categoryId = 27; //Education
        this.videoId = '';
        this.uploadStartTime = 0;

        this.loggedIn = false;
        this.duringUpload = false;
        this.postUpload = false;

        this.platform = platform;
        this.cordovaOauth = new CordovaOauth(new Google({ "clientId": browser_clientid, "appScope": appScope, "redirectUri": "http://localhost/callback" }));
    }

    login() {
        this.platform.ready().then(() => {
            this.cordovaOauth.login().then((success) => {
                this.loggedIn = true;
                this.accessToken = success.access_token;
                this.authenticated = true;
            }, (error) => {
                alert(error);
            });
        });
    }
    handleUploadClicked() {
        var input = <HTMLInputElement>$('#file')[0];
        var file = input.files[0];
        //var file = ($('#file').get(0).files[0]);
        alert("Uploading: " + file.name + " @ " + file.size + " bytes");
        this.uploadFile(file);
    }

    uploadFile(file) {
        var metadata = {
            snippet: {
                title: this.videoTitle,
                description: this.videoDesc,
                tags: this.tags,
                categoryId: this.categoryId
            },
            status: {
                privacyStatus: this.videoPrivacy
            }
        };
        var uploader = new MediaUploader({
            baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
            file: file,
            token: this.accessToken,
            metadata: metadata,
            params: {
                part: Object.keys(metadata).join(',')
            },
            onError: function(data) {
                var message = data;
                // Assuming the error is raised by the YouTube API, data will be
                // a JSON string with error.message set. That may not be the
                // only time onError will be raised, though.
                try {
                    var errorResponse = JSON.parse(data);
                    message = errorResponse.error.message;
                } finally {
                    alert(message);
                }
            }.bind(this),
            onProgress: function(data) {
                var currentTime = Date.now();
                var bytesUploaded = data.loaded;
                var totalBytes = data.total;
                // The times are in millis, so we need to divide by 1000 to get seconds.
                var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
                var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
                var percentageComplete = (bytesUploaded * 100) / totalBytes;

                $('#upload-progress').attr({
                    value: bytesUploaded,
                    max: totalBytes
                });
                $('#percent-transferred').text(percentageComplete);
                $('#bytes-transferred').text(bytesUploaded);
                $('#total-bytes').text(totalBytes);

                this.duringUpload = true;
            }.bind(this),
            onComplete: function(data) {
                var uploadResponse = JSON.parse(data);
                this.videoId = uploadResponse.id;
                $('#video-id').text(this.videoId);
                this.postUpload = true;
                alert("Successfully uploaded video on youtube :" + this.videoId);
                if (this.task === "upload") {
                    this.uploadResponse(this.videoId);
                }
                if (this.task === "resubmit") {
                    this.resubmitResponse(this.videoId);
                }
            }.bind(this)
        });
        // This won't correspond to the *exact* start of the upload, but it should be close enough.
        this.uploadStartTime = Date.now();
        uploader.upload();
    }
    uploadResponse(videoId) {
        console.log("uploadResponse : " + videoId);
        console.log("student " + this.student);
        console.log("this.assignmentDetail");
        console.log(this.assignmentDetail);

        let attachmentUrl = "http://www.youtube.com/embed/" + videoId;
        let myresponse = {};
        myresponse["attachmentUrl"] = attachmentUrl;
        myresponse["teacher_feedback"] = {
            "Rating on Scale of 5": 0,
            "Comment": "Post Review Comments Here..."
        };
        let peers_feedback = {};
        let reviewed_by_peers = this.assignmentDetail["peer_review_map"][this.student]["reviewed_by"];
        console.log("reviewed_by_peers : " + reviewed_by_peers);
        for (let peer of reviewed_by_peers) {
            peers_feedback[peer] = {
                "Where concepts explained clearly ?": 0,
                "Did you learn anything new ?": "Yes/No . If Yes, brief about it...",
                "Did you get confused ?": "Yes/No . If Yes, brief about it...",
                "feedback_submitted": false
            }
        }
        myresponse["peers_feedback"] = peers_feedback;
        myresponse["all_peers_reviewed"] = false;
        let submittedOnDate = new Date();
        let submittedOnDateString = submittedOnDate.toISOString();
        myresponse["submittedOn"] = submittedOnDateString;
        myresponse["cumulative_rating"] = 0;

        console.log(myresponse);
        this.assignmentDetail["responses"][this.student] = myresponse;
        //this.assignmentDetail["teacher_yet_to_review"].push(this.student);
        let index = this.assignmentDetail["teacher_yet_to_review"].indexOf(this.student);
        if (index == -1) {
            this.assignmentDetail["teacher_yet_to_review"].push(this.student);
        }

        console.log(this.assignmentDetail);

        //this.videoTitle, this.student, myresponse
        var obj = this;
        this.dataService.updateResponse(obj.videoTitle, obj.student, myresponse).then(function(response) {
            if (response["ok"] == true) {

                let index = obj.uploaded_assignments.indexOf(obj.videoTitle);
                if (index == -1) {
                    obj.uploaded_assignments.push(obj.videoTitle);
                }
                console.log("uploaded_assignments : " + obj.uploaded_assignments);
                let currentDate = new Date();
                let hardDeadlineDate = new Date(obj.assignmentDetail["hard_deadline_due"]);
                if (currentDate <= hardDeadlineDate) {//can resubmit
                    let index = obj.canResubmit_assignments.indexOf(obj.videoTitle);
                    if (index == -1) {
                        obj.canResubmit_assignments.push(obj.videoTitle);
                    }
                    console.log("canResubmit_assignments : " + obj.canResubmit_assignments);
                } else {//cannot resubmit
                    let index = obj.completed_assignments.indexOf(obj.videoTitle);
                    if (index == -1) {
                        obj.completed_assignments.push(obj.videoTitle);
                    }
                    console.log("completed_assignments : " + obj.completed_assignments);
                }

                index = obj.yetToUpload_assignments.indexOf(obj.videoTitle);
                obj.yetToUpload_assignments.splice(index, 1);
                index = obj.safe_submit_assignments.indexOf(obj.videoTitle);
                obj.safe_submit_assignments.splice(index, 1);
                index = obj.soft_deadline_expired_assignments.indexOf(obj.videoTitle);
                obj.soft_deadline_expired_assignments.splice(index, 1);

                let toastmsg = obj.lib.showToastMsgWithCloseButton("Successfully submitted : " + obj.videoTitle);
                obj.nav.present(toastmsg);
                obj.nav.pop();
            } else {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to submit : " + obj.videoTitle);
                obj.nav.present(toastmsg);
                obj.nav.pop();
            }
        });
    }

    resubmitResponse(videoId) {
        console.log("uploadResponse : " + videoId);
        console.log("student " + this.student);
        console.log("this.assignmentDetail");
        console.log(this.assignmentDetail);

        let attachmentUrl = "http://www.youtube.com/embed/" + videoId;
        let myresponse = {};
        myresponse["attachmentUrl"] = attachmentUrl;
        myresponse["teacher_feedback"] = {
            "Rating on Scale of 5": 0,
            "Comment": "Post Review Comments Here..."
        };
        let peers_feedback = {};
        let reviewed_by_peers = this.assignmentDetail["peer_review_map"][this.student]["reviewed_by"];
        console.log("reviewed_by_peers : " + reviewed_by_peers);
        for (let peer of reviewed_by_peers) {
            peers_feedback[peer] = {
                "Where concepts explained clearly ?": 0,
                "Did you learn anything new ?": "Yes/No . If Yes, brief about it...",
                "Did you get confused ?": "Yes/No . If Yes, brief about it...",
                "feedback_submitted": false
            }
        }
        myresponse["peers_feedback"] = peers_feedback;
        myresponse["all_peers_reviewed"] = false;
        let submittedOnDate = new Date();
        let submittedOnDateString = submittedOnDate.toISOString();
        myresponse["submittedOn"] = submittedOnDateString;
        myresponse["cumulative_rating"] = 0;

        console.log(myresponse);
        this.assignmentDetail["responses"][this.student] = myresponse;
        let index = this.assignmentDetail["teacher_yet_to_review"].indexOf(this.student);
        if (index == -1) {
            this.assignmentDetail["teacher_yet_to_review"].push(this.student);
        }

        console.log(this.assignmentDetail);

        //this.videoTitle, this.student, myresponse
        var obj = this;
        this.dataService.updateResponse(obj.videoTitle, obj.student, myresponse).then(function(response) {
            if (response["ok"] == true) {
                let index = obj.canResubmit_assignments.indexOf(obj.videoTitle);
                obj.canResubmit_assignments.splice(index, 1);
                index = obj.completed_assignments.indexOf(obj.videoTitle);
                if (index == -1) {
                    obj.completed_assignments.push(obj.videoTitle);
                }
                console.log("completed_assignments : " + obj.completed_assignments);

                index = obj.yetToUpload_assignments.indexOf(obj.videoTitle);
                obj.yetToUpload_assignments.splice(index, 1);
                index = obj.safe_submit_assignments.indexOf(obj.videoTitle);
                obj.safe_submit_assignments.splice(index, 1);
                index = obj.soft_deadline_expired_assignments.indexOf(obj.videoTitle);
                obj.soft_deadline_expired_assignments.splice(index, 1);

                let toastmsg = obj.lib.showToastMsgWithCloseButton("Successfully submitted : " + obj.videoTitle);
                obj.nav.present(toastmsg);
                obj.nav.pop();
            } else {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to submit : " + obj.videoTitle);
                obj.nav.present(toastmsg);
                obj.nav.pop();
            }
        });
    }
}
