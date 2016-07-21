import {Injectable} from '@angular/core';
import {Toast} from 'ionic-angular';

@Injectable()
export class Lib {
    constructor() { }
    showToastMsgWithCloseButton(msg) {
        const toast = Toast.create({
            message: msg,
            showCloseButton: true,
            closeButtonText: 'Ok'
        });
        return toast;
    }

    getSubjectImg(subject) {
        //console.log(subject);      
        switch (subject) {
            case "ENGLISH": return "images/english.jpg";
            case "MATHS": return "images/maths.jpg";
            case "PHYSICS": return "images/physics.jpg";
            case "BIOLOGY": return "images/biology.jpg";
            case "CHEMISTRY": return "images/chemistry.jpg";
            case "SOCIAL": return "images/social.jpg";
            default: return "images/default.jpg";
        }
    }
}
