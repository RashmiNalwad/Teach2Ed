import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import {Data} from '../../providers/data/data';
import { ClassService } from '../../providers/class-service/class-service';
import {Lib} from '../../providers/lib/lib';
@Component({
    templateUrl: 'build/pages/class-addition-modal/class-addition-modal.html',
    providers: [ClassService]
})
export class ClassAdditionModalPage {
    private myClasses: any;
    private studentCount: any;
    private teacherId: string;
    constructor(private nav: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public classService: ClassService,
        private dataService: Data, private lib: Lib) {
        this.myClasses = this.navParams.get("myClasses");
        this.studentCount = this.navParams.get("studentCount");
        this.teacherId = this.navParams.get("teacherId");
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onSubmit(formData) {
        let newClassName = formData.newClassName.toUpperCase();
        let newSpl       = formData.newSpl.toUpperCase();
        let newSubject   = formData.newSubject.toUpperCase();
        let newClassGrp = (newClassName + "_" + newSubject).toUpperCase();
        var obj = this;
        this.classService.addClass(newClassName, newSpl, newSubject).then(function(response){
          if(response){
            obj.dataService.addClassGrp(newClassGrp, obj.teacherId).then(function(response) {
                //console.log(response);
                if (response["status"] == 409) {
                    console.log(response);
                    let toastmsg = obj.lib.showToastMsgWithCloseButton(newClassGrp + " already exits !!!");
                    obj.nav.present(toastmsg);
                    //obj.viewCtrl.dismiss();
                } else {

                    obj.studentCount[newClassGrp] = 0;
                    obj.myClasses.push(newClassGrp);
                    let toastmsg = obj.lib.showToastMsgWithCloseButton(newClassGrp + " created succesfully");
                    obj.nav.present(toastmsg);
                    //obj.viewCtrl.dismiss();
                }
            });
          }else{
            let toastmsg = obj.lib.showToastMsgWithCloseButton(newSubject + " subject already exits in " + newClassName);
            obj.nav.present(toastmsg);
            //obj.viewCtrl.dismiss();
          }
        });
    }

}
