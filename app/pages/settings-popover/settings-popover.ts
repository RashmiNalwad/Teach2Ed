import {NavController} from 'ionic-angular';
import {Component, ViewChild, ElementRef} from '@angular/core';
import {App, Popover,Modal, Content, Alert,NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service/auth-service';
import {HomePage} from '../home/home';
import {KnowUsModalPage} from '../know-us-modal/know-us-modal';
import {HelpModalPage} from '../help-modal/help-modal';
import {AppDetailsModalPage} from '../app-details-modal/app-details-modal';

/*
  Generated class for the SettingsPopoverPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/settings-popover/settings-popover.html',
})
export class SettingsPopoverPage {
  userInfo: any;
  contentEle: any;
  textEle: any;

  constructor(public nav: NavController,public navParams: NavParams,private authService: AuthService) {
    // this.userInfo = navParams.get('info');
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.contentEle = this.navParams.data.contentEle;
      this.textEle = this.navParams.data.textEle;
    }
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

  openAppDetails()
  {
    let modal = Modal.create(AppDetailsModalPage,{App_Details:"App Details"});
    this.nav.present(modal);
  }

  openKnowUsDetails()
  {
    let modal = Modal.create(KnowUsModalPage);
    this.nav.present(modal);
  }

  openHelpDetails()
  {
    let modal = Modal.create(HelpModalPage);
    this.nav.present(modal);
  }
}
