import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {Page, Alert, NavController, NavParams, Toast,App, Popover, Content,Loading} from 'ionic-angular';
import {Component, ViewChild, ElementRef} from '@angular/core';
import {StudentCurrentPage} from "../student-current/student-current";
import {HomePage} from '../home/home';
import {AuthService} from '../../providers/auth-service/auth-service';
import {SettingsPopoverPage} from "../settings-popover/settings-popover";

@Page({
    templateUrl: 'build/pages/student-current/student-current.html',
})
class CurrentDetailsPage {
    item;
    public character

    constructor(params: NavParams) {
        this.item = params.data.item;
    }
}

@Page({
    templateUrl: 'build/pages/welcome-student/welcome-student.html',
})
export class WelcomeStudentPage {
    userInfo: any;
    email: string;
    root: string;
    items = []; //Classes
    chapters = [];//Chapters for a class
    db_subjects = [];//class subjects retrieved from database like Class9_Maths,Class9_Biology
    student_grade: string;// Student's grade like 8th standard,9th standard etc
    profileImgSrc: string;
    loading: any;

    @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
    @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

    constructor(public nav: NavController, navParams: NavParams,
        private authService: AuthService,
        private dataService: Data, private lib: Lib) {
        this.userInfo = navParams.get('info');
        this.email = this.userInfo.userId;
        this.root = "courses";
        this.loading = Loading.create({
            content: 'Fetching Classes...'
        });
    }
    getSubjectImg(subject) {
        return this.lib.getSubjectImg(subject);
    }
    setAvatar(gender) {
        switch (gender) {
            case "MALE": this.profileImgSrc = "images/boy.png"; break;
            case "FEMALE": this.profileImgSrc = "images/girl.png"; break;
        }
    }
    ionViewWillEnter() {
        this.nav.present(this.loading);
        //console.log(this.email);
        this.dataService.getUserInfo(this.email).then((userInfo) => {
            if (userInfo) {
                this.setAvatar(userInfo["gender"]);
                this.db_subjects = userInfo["subjects"];
                this.items = [];
                for (var sub of this.db_subjects) {
                    let classSubject = sub.split("_");
                    this.student_grade = classSubject[0];
                    this.items.push(classSubject[1]);
                }
                this.loading.dismiss();
            }
        })
    }

    openChapterDetailsPage(className) {
        this.nav.push(StudentCurrentPage, { className: className, studentGrade: this.student_grade, email: this.email });
    }

    presentPopover(ev) {
      let popover = Popover.create(SettingsPopoverPage, {

      });

      this.nav.present(popover, {
        ev: ev
      });
    }
}
