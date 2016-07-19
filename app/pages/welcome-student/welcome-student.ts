import {Page, Alert, NavController, NavParams, Toast} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {StudentCurrentPage} from "../student-current/student-current";

@Page({
    templateUrl: 'build/pages/student-current/student-current.html',
})
class CurrentDetailsPage {
    item;
    public character

    constructor(params: NavParams) {
        this.item = params.data.item;
    }
}

@Page({
  templateUrl: 'build/pages/welcome-student/welcome-student.html',
})
export class WelcomeStudentPage {
  userInfo: any;
  email: string;
  class: string;//Selected Class Name
  root: string;
  items = []; //Classes
  chapters = [];//Chapters for a class
  db_subjects = [];//class subjects retrieved from database like Class9_Maths,Class9_Biology
  student_grade: string;// Student's grade like 8th standard,9th standard etc
  icons_names_map:{};//map of subject names and icons letter
  res:string;
  link:string;
  constructor(public nav: NavController, navParams: NavParams, private dataService: Data, private lib: Lib) {
    this.userInfo = navParams.get('info');
    this.email = this.userInfo.userId;
    //this.email = navParams.get('uname');
    this.root = "courses";
  }

  ionViewWillEnter(){
    console.log(this.email);
    this.dataService.getUserInfo(this.email).then((userInfo) => {
      if(userInfo){
        this.db_subjects = userInfo["subjects"];
        this.items = [];
        this.icons_names_map = {};
        for(var sub of this.db_subjects){
            this.items.push(sub.split("_")[1]);
            this.student_grade = sub.split("_")[0];
            this.res = sub.split("_")[1].charAt(0);
            this.link = "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/32/Letter-"+this.res+"-icon.png";
            // this.link = "http://icons.iconarchive.com/icons/iconicon/alpha-magnets/128/Letter-"+this.res+"-icon.png";
            this.icons_names_map[sub.split("_")[1]] = this.link;
        }
      }
    })
  }

  setChapters(){
    this.dataService.getChapters(this.class).then((chapterInfo) => {
      if(chapterInfo){
        this.chapters = chapterInfo["class"];
        console.log(chapterInfo);
      }
    })
  }

  openChapterDetailsPage(className){
      this.nav.push(StudentCurrentPage, { className: className, studentGrade: this.student_grade, email:this.email });
  }
}
