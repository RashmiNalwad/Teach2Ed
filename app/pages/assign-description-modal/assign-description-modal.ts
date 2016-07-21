import {Component} from '@angular/core';
import {ViewController, NavController, NavParams} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';

@Component({
    templateUrl: 'build/pages/assign-description-modal/assign-description-modal.html',
})
export class AssignDescriptionModalPage {

    assign_description: string;
    assignment: string;
    max_response_time = 0;
    assigned_on: string;
    edit: boolean;

    constructor(public nav: NavController, public params: NavParams, public viewCtrl: ViewController,
        private dataService: Data, private lib: Lib) {
        this.assign_description = this.params.get('description');
        this.assignment = this.params.get('assignment');
        this.max_response_time = this.params.get('max_response_time');
        this.assigned_on = this.params.get('assigned_on');
        this.edit = this.params.get('edit');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    updateAssignment() {
        var obj = this;
        this.dataService.updateAssignmentInfo(this.assignment, this.assign_description, this.max_response_time).then(function(response) {
            if (response["ok"] != true) {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Unable to update assignment !!! ");
                obj.nav.present(toastmsg);
            } else {
                let toastmsg = obj.lib.showToastMsgWithCloseButton("Succesfully updated assignment");
                obj.nav.present(toastmsg);
            }
        });
    }
}
