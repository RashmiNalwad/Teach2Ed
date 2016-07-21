import { Component } from '@angular/core';
import {Page,NavController,ViewController } from 'ionic-angular';

/*
  Generated class for the KnowUsModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/know-us-modal/know-us-modal.html',
})
export class KnowUsModalPage {
  krishna:string;
  ravi:string;
  rashmi:string;

  constructor(private nav: NavController, public viewCtrl: ViewController) {

  }

  ngOnInit(){
    this.krishna = "Manager";
    this.ravi = "Graduate Student USC";
    this.rashmi = "Graduate Student USC";
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }

}
