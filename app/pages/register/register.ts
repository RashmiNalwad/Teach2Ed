import { Component } from '@angular/core';
import { Page, NavController, NavParams, Alert } from 'ionic-angular';
import { Dialogs } from "ionic-native/dist/index";
import { FORM_DIRECTIVES, FormBuilder, Validators, AbstractControl, ControlGroup } from '@angular/common';
//import {AuthService} from '../../providers/auth-service/auth-service';
import { ClassService } from '../../providers/class-service/class-service';
import { LoginPage }  from '../login/login';
import {AuthService} from '../../providers/auth-service/auth-service';
import {Lib} from '../../providers/lib/lib';

let bcrypt = require('bcryptjs');

/*
  Generated class for the RegisterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
    templateUrl: 'build/pages/register/register.html',
    providers: [AuthService, ClassService]
})
export class RegisterPage {

    private classes: any = [];
    private specializations: any = [];
    private subjects: any = [];
    private results: any = [];
    private className: string;
    //private formData: any;


    constructor(public nav: NavController,
        public authService: AuthService,
        public formBuilder: FormBuilder,
        public classService: ClassService, private lib: Lib) {

        this.nav = nav;
        this.authService = authService;
        this.classService = classService;

        this.classService.loadClassesInfo().then((res) => {
            this.results = res;
            this.classes = (Object.keys(res));
        });

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
        //console.log(formData.userPassword);
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(formData.userPassword, salt, function(err, hash) {
                // Store hash in your password DB.
                //console.log(formData.userPassword + hash);
                formData.userPassword = hash;
            });
        });

        this.authService.registerUser(formData).then((result) => {
            if (result) {
                let alert = Alert.create({
                    title: 'Register confirmation!',
                    subTitle: 'Your successfully completed the registration!',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.nav.push(LoginPage);
                        }
                    }]
                });
                this.nav.present(alert);
                this.nav.setRoot(LoginPage);
            } else {
                let alert = Alert.create({
                    title: 'Register confirmation!',
                    subTitle: 'User Id already exist, please choose another User Id!',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.nav.pop();
                        }
                    }]
                });
                this.nav.present(alert);

            }
        });
    }

}
