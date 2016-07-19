import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/detail-ratings-modal/detail-ratings-modal.html',
})
export class DetailRatingsModalPage {
    myresponse: any;
    peers: any;
    myRating: number;
    constructor(public nav: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController) {
        this.myresponse = this.navParams.get("myresponse");
        this.peers = Object.keys(this.myresponse["peers_feedback"]);
        this.myRating = 4.5;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
