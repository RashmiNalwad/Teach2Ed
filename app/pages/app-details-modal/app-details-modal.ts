import { Component } from '@angular/core';
import { NavController,NavParams,ViewController } from 'ionic-angular';

/*
  Generated class for the AppDetailsModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/app-details-modal/app-details-modal.html',
})
export class AppDetailsModalPage {
  app_description:string;
  termsPolicy:string;
  version:string;

  constructor(private nav: NavController,public params: NavParams, public viewCtrl: ViewController) {
    this.app_description = this.params.get('app_details');
  }

  ngOnInit(){
    this.app_description = "bla bla";
    this.termsPolicy = "terms and condition";
    this.version = "1.0.0";
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }

}
