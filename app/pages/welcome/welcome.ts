import { Component } from '@angular/core';
import { Page, NavController, NavParams } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service/auth-service';
import {TabsPage} from '../../pages/tabs/tabs';
import {Dialogs} from "ionic-native/dist/index";
import {Alert} from "ionic-angular/index";
import {FORM_DIRECTIVES, FormBuilder, Validators, AbstractControl, ControlGroup } from '@angular/common';

/*
  Generated class for the WelcomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    templateUrl: 'build/pages/welcome/welcome.html',
    providers: [AuthService]
})
export class WelcomePage {
    public userInfo: any;

    constructor(private nav: NavController,
        private authService: AuthService,
        public navParams: NavParams) {
        this.nav = nav;
        this.authService = authService;
        this.navParams = navParams;
        this.userInfo = this.navParams.get('info');
    }

    logout() {
        console.log('inside the log out call' + this.userInfo.userId);
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

}
