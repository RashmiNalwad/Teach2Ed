import { Component } from '@angular/core';
import {AuthService} from '../../providers/auth-service/auth-service';
import {TabsPage} from '../../pages/tabs/tabs';

import {Modal, Loading, Page, NavController, NavParams, Alert, Toast} from 'ionic-angular';
import {ClassGroupPage} from '../class-group/class-group';
import {ClassSelectionModalPage} from '../class-selection-modal/class-selection-modal';
import {ClassAdditionModalPage} from '../class-addition-modal/class-addition-modal';
import {HomePage} from '../home/home';

import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';

@Component({
    templateUrl: 'build/pages/welcome-teacher/welcome-teacher.html',
})
export class WelcomeTeacherPage {
    userInfo: any;
    myClasses = [];
    loading: any;
    email: string;
    teacherId: string;
    studentCount = {};
    profileImgSrc: string;
    constructor(public nav: NavController, navParams: NavParams,
        private authService: AuthService,
        private dataService: Data, private lib: Lib) {
        this.userInfo = navParams.get('info');
        this.email = this.userInfo.userId;
        this.teacherId = "teacher_" + this.email;
        this.loading = Loading.create({
            content: 'Fetching Classes...'
        });
    }
    setAvatar(gender) {
        switch (gender) {
            case "MALE": this.profileImgSrc = "images/maleTeacher.png"; break;
            case "FEMALE": this.profileImgSrc = "images/femaleTeacher.png"; break;
        }
    }
    getClassImg(className){
      let classNameArray = className.split("_");
      return this.lib.getSubjectImg(classNameArray[1]);
    }
    ionViewWillEnter() {
        let obj = this;
        this.nav.present(this.loading);
        this.dataService.getUserInfo(this.teacherId).then((userInfo) => {
            if (userInfo) {
                this.setAvatar(userInfo["gender"]);
                this.myClasses = userInfo["class_subject"];
                for (let className of this.myClasses) {
                    obj.dataService.getClassGrp(className).then((classGrp) => {
                        //console.log(classGrp["students"]);
                        if (classGrp) {
                            this.studentCount[className] = classGrp["students"].length;
                        } else {
                            this.studentCount[className] = 0;
                        }
                    })
                }
                this.loading.dismiss();
            }
        })
    }
    getClassName(className) {
        let classNameArray = className.split("_");
        return classNameArray[0];
    }
    getSubject(className) {
        let classNameArray = className.split("_");
        return classNameArray[1];
    }

    getStudentCount(className) {
        //console.log("in getStudentCount(" + className + ")");
        return this.studentCount[className];
    }
    logout() {
        this.authService.loginOut(this.userInfo);
        let alert = Alert.create({
          title: 'Confirm to Logout',
          subTitle: 'Would you like to Log out ?',
          buttons: [{
              text: 'YES',
                handler: () => {
                    this.nav.setRoot(HomePage);
                }
            }]
        });
        this.nav.present(alert);
    }
    goTo_Class(className) {
        //console.log('pushing: ' + className);
        this.nav.push(ClassGroupPage, { classGrp: className })
    }

    selectNewClass() {
        let modal = Modal.create(ClassSelectionModalPage,
            { "myClasses": this.myClasses, "teacherId": this.teacherId, "studentCount": this.studentCount });
        this.nav.present(modal);
    }

    addNewClass() {
        let modal = Modal.create(ClassAdditionModalPage,
            { "myClasses": this.myClasses, "teacherId": this.teacherId, "studentCount": this.studentCount });
        this.nav.present(modal);
    }
}
