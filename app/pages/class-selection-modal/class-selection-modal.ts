import { Component } from '@angular/core';
import { NavController, ViewController, Alert, NavParams } from 'ionic-angular';
import { ClassService } from '../../providers/class-service/class-service';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';

@Component({
    templateUrl: 'build/pages/class-selection-modal/class-selection-modal.html',
    providers: [ClassService]
})
export class ClassSelectionModalPage {
    private classes: any = [];
    private specializations: any = [];
    private subjects: any = [];
    private results: any = [];
    private className: string;

    private myClasses: any;
    private studentCount: any;
    private teacherId: string;

    constructor(private nav: NavController,
        public navParams: NavParams,
        public classService: ClassService,
        public viewCtrl: ViewController,
        private dataService: Data, private lib: Lib) {

        this.myClasses = this.navParams.get("myClasses");
        this.studentCount = this.navParams.get("studentCount");
        this.teacherId = this.navParams.get("teacherId");

        this.classService.loadClassesInfo().then((res) => {
            this.results = res;
            this.classes = (Object.keys(res));
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    classTapped(className) {
        if(Object.keys(this.results).length == 0){
          let toastmsg = this.lib.showToastMsgWithCloseButton("No classes open for registration !!!");
          this.nav.present(toastmsg);
          return;
        }
        this.className = className;
        this.specializations = Object.keys(this.results[className]);
    }

    splTapped(specialization) {
        if(Object.keys(this.results).length == 0){
          let toastmsg = this.lib.showToastMsgWithCloseButton("No classes open for registration !!!");
          this.nav.present(toastmsg);
          return;
        }
        //console.log(this.results);
        //console.log(this.results[this.className]);
        //console.log(this.results[this.className][specialization]);
        this.subjects = this.results[this.className][specialization];
    }

    onSubmit(formData) {
        let className = formData.classGrade;
        console.log(formData.selectedSubjects);
        //for (let subject of formData.selectedSubjects) {
        let subject = formData.selectedSubject;
            console.log(subject);
            let classgrp = (className + "_" + subject).toUpperCase();
            var obj = this;
            this.dataService.selectClassGrp(classgrp, this.teacherId).then(function(response) {
                console.log(classgrp);
                console.log(response);
                if (response === undefined) {
                    let toastmsg = obj.lib.showToastMsgWithCloseButton(classgrp + " already selected !!!");
                    obj.nav.present(toastmsg);
                } else {

                    obj.dataService.getClassGrp(classgrp).then((classGrp) => {
                        console.log(classGrp["students"]);
                        if (classGrp) {
                            obj.studentCount[className] = classGrp["students"].length;
                            console.log(obj.studentCount[className]);
                        }else{
                          obj.studentCount[className] = 0;
                        }
                    })
                    obj.myClasses.push(classgrp);

                    let toastmsg = obj.lib.showToastMsgWithCloseButton(classgrp + " added succesfully");
                    obj.nav.present(toastmsg);
                }
            });
        this.viewCtrl.dismiss();
    }
}
