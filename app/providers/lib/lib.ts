import {Injectable} from '@angular/core';
import {Toast} from 'ionic-angular';

@Injectable()
export class Lib {

  constructor() {}
  showToastMsgWithCloseButton(msg){
    const toast = Toast.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    return toast;
    //this.nav.present(toast);
  }
}
