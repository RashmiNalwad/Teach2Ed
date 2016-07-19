import { Component } from '@angular/core';
import { Page, NavController} from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage }  from '../login/login';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  private  rootpage: any;
  static get parameters(){
	  return [[NavController]];
  }
  constructor(private nav: NavController) {
	  this.nav = nav;
  }

  goToRegister() {
	  //console.log('inside the go to register method');
	  //this.rootpage = Register;
	  this.nav.setRoot(RegisterPage);
  }

  goToLogin() {
	  //console.log('inside the go to Login Page');
	  //this.rootpage = Login;
	  this.nav.setRoot(LoginPage);
  }
}
