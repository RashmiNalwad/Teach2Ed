import {Component, Input} from '@angular/core';
import {NavController, IONIC_DIRECTIVES} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {AssignmentToReviewPage} from '../assignment-to-review/assignment-to-review';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';

@Component({
    templateUrl: 'build/pages/student-assignment/student-assignment.html',
    selector: 'student-assignment',
    directives: [IONIC_DIRECTIVES]
})
export class StudentAssignment {
    @Input() student_id: string;
    @Input() response: any;
    @Input() reviewed: boolean;
    @Input() title: string;
    @Input() teacher_yet_to_review: any;
    submitted_on: string;
    url: SafeResourceUrl;
    gender: string;
    fname: string;
    lname: string;
    profileImgSrc: string;
    constructor(private nav:NavController,private dataService:Data, private lib: Lib, private sanitizer: DomSanitizationService) {
      //this.url = sanitizer.bypassSecurityTrustResourceUrl(this.response.attachmentUrl);
    }

    getAvatar(){
      switch(this.gender){
        case "MALE" : this.profileImgSrc = "images/boy.png"; break;
        case "FEMALE" : this.profileImgSrc = "images/girl.png";break;
      }
    }

    ngOnInit(){
        //console.log(this.response);
        let d = new Date(this.response.submittedOn);
        this.submitted_on = d.toLocaleString()//d.toDateString();
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.response.attachmentUrl);//WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
        var obj=this;
        this.dataService.getBasicUserInfo(obj.student_id).then(function(response){
          //console.log(response);
          if(response){
            obj.fname = response["first_name"];
            obj.lname = response["last_name"];
            obj.gender = response["gender"];
            obj.getAvatar();
          }else{
            let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to fetch user info for " + obj.student_id);
            obj.nav.present(toastmsg);
          }
        });
    }

    submitReview(){
      console.log(this.teacher_yet_to_review);
      let index = this.teacher_yet_to_review.indexOf(this.student_id);
      this.teacher_yet_to_review.splice(index,1);
      console.log(this.teacher_yet_to_review);
      var obj = this;
      this.reviewed = true;
      this.response.teacher_reviewed = true;
      console.log(this.title);
      console.log(this.student_id);
      console.log(this.response);
      this.dataService.submitReview(this.title, this.student_id, this.response.teacher_reviewed, this.response.teacher_feedback).then(function(response){
        if(response["ok"] == true){
          let toastmsg = obj.lib.showToastMsgWithCloseButton("Succesfully Submitted Review");
          obj.nav.present(toastmsg);
        }else{
          let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to submit review, Try Again");
          obj.nav.present(toastmsg);
        }
      });
    }
}
