import { Component } from '@angular/core';
import { Page, NavController, NavParams } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service/auth-service';
import {Dialogs} from "ionic-native/dist/index";
import {Alert} from "ionic-angular/index";
//import {WelcomePage} from '../welcome/welcome';
import {WelcomeStudentPage} from '../welcome-student/welcome-student';
import {WelcomeTeacherPage} from '../welcome-teacher/welcome-teacher';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    templateUrl: 'build/pages/login/login.html',
    providers: [AuthService]
})
export class LoginPage {



    constructor(private nav: NavController, private authService: AuthService) {
        this.nav = nav;
        this.authService = authService;

    }

    onSubmit(loginData) {
        this.authService.loginUser(loginData.userId, loginData.userPassword).then((result) => {

            if (result) {
            	  //console.log(result);
                /*this.nav.push(WelcomePage, {
                    info: result
                });*/
                if(result['type'] == "student"){
                  this.nav.push(WelcomeStudentPage, { info: result });
                }
                if(result['type'] == "teacher"){
                  this.nav.push(WelcomeTeacherPage, { info: result });
                }
            } else {
                let alert = Alert.create({
                    title: 'Login failure!',
                    subTitle: 'Please check your userId and Password and log in back!',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            console.log('inside the button click');
                            this.nav.pop();
                        }
                    }]
                });
                this.nav.present(alert);
            }

        }).catch((err) => {
            console.log(err);
        });
    }

}
