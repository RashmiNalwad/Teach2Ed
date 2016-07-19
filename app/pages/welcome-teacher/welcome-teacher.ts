import { Component } from '@angular/core';
import {AuthService} from '../../providers/auth-service/auth-service';
import {TabsPage} from '../../pages/tabs/tabs';

import {Modal, Loading, Page, NavController, NavParams, Alert, Toast} from 'ionic-angular';
import {ClassGroupPage} from '../class-group/class-group';
import {ClassSelectionModalPage} from '../class-selection-modal/class-selection-modal';
import {ClassAdditionModalPage} from '../class-addition-modal/class-addition-modal';

import {Data} from '../../providers/data/data';

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
    constructor(public nav: NavController, navParams: NavParams,
        private authService: AuthService,
        private dataService: Data) {
        this.userInfo = navParams.get('info');
        this.email = this.userInfo.userId;
        this.teacherId = "teacher_" + this.email;
        this.loading = Loading.create({
            content: 'Fetching Classes...'
        });
    }
    ionViewWillEnter() {
        let obj = this;
        this.nav.present(this.loading);
        this.dataService.getUserInfo(this.teacherId).then((userInfo) => {
            if (userInfo) {
                this.myClasses = userInfo["class_subject"];
                for(let className of this.myClasses){
                  obj.dataService.getClassGrp(className).then((classGrp) => {
                      //console.log(classGrp["students"]);
                      if (classGrp) {
                          this.studentCount[className] = classGrp["students"].length;
                      }else{
                        this.studentCount[className] = 0;
                      }
                  })
                }
                this.loading.dismiss();
            }
        })
    }
    getClassName(className){
      let classNameArray = className.split("_");
      return classNameArray[0];
    }
    getSubject(className){
      let classNameArray = className.split("_");
      return classNameArray[1];
    }
    getClassImg(className){
      let classNameArray = className.split("_");
      switch(classNameArray[1]){
        case "ENGLISH" : return "images/english.jpg";
        case "MATHS" : return "images/maths.jpg";
        case "PHYSICS" : return "images/physics.jpg";
        case "BIOLOGY" : return "images/biology.jpg";
        case "CHEMISTRY" : return "images/chemistry.jpg";
        case "SOCIAL" : return "images/social.jpg";
        default: return "images/default.jpg";
      }
    }
    getStudentCount(className){
      //console.log("in getStudentCount(" + className + ")");
      return this.studentCount[className];
    }
    logout() {
        this.authService.loginOut(this.userInfo);
        let alert = Alert.create({
            title: 'Logout confirmation!',
            subTitle: 'Will be Log out from the Site!',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.nav.setRoot(TabsPage);
                }
            }]
        });
        this.nav.present(alert);
    }
    goTo_Class(className) {
        //console.log('pushing: ' + className);
        this.nav.push(ClassGroupPage, { classGrp: className })
    }

    selectNewClass(){
      let modal = Modal.create(ClassSelectionModalPage,
        {"myClasses" : this.myClasses, "teacherId" : this.teacherId, "studentCount" : this.studentCount});
      this.nav.present(modal);
    }

    addNewClass(){
      let modal = Modal.create(ClassAdditionModalPage,
        {"myClasses" : this.myClasses, "teacherId" : this.teacherId, "studentCount" : this.studentCount});
      this.nav.present(modal);
    }
}
