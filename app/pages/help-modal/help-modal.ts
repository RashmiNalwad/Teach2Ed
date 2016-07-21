import { Component } from '@angular/core';
import {Page,NavController,ViewController } from 'ionic-angular';

/*
  Generated class for the HelpModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/help-modal/help-modal.html',
})
export class HelpModalPage {

  constructor(private nav: NavController, public viewCtrl: ViewController) {

  }
  dismiss() {
      this.viewCtrl.dismiss();
  }

}
