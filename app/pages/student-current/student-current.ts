import {Page, Alert, NavController, NavParams, Toast, Loading} from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {Lib} from '../../providers/lib/lib';
import {StudentUploadPage} from "../student-upload/student-upload";

@Page({
    templateUrl: 'build/pages/student-upload/student-upload.html',
})
class UploadDetailsPage {
    item;

    constructor(params: NavParams) {
        this.item = params.data.item;
    }
}

@Page({
    templateUrl: 'build/pages/student-current/student-current.html',
})
export class StudentCurrentPage {
    items = [];
    chapters = [];
    classSelected: string;
    chapter_assignments = {};
    student_grade: string;
    icons_chap_map = {};
    res: string;
    link: string;
    email: string;
    loading: any;
    constructor(public nav: NavController, navParams: NavParams, private dataService: Data, private lib: Lib) {
        this.classSelected = navParams.data.className;
        this.student_grade = navParams.data.studentGrade;
        this.email = navParams.data.email;
        //console.log(this.classSelected);
        //console.log(this.student_grade);
        this.loading = Loading.create({
            content: 'Fetching Chapters...'
        });
    }

    ionViewWillEnter() {
        this.nav.present(this.loading);
        this.chapters = [];
        this.chapter_assignments = {};
        this.dataService.getChapters(this.student_grade + "_" + this.classSelected).then((classInfo) => {
            if (classInfo) {
                for (let chapter in classInfo["chapters"]) {
                    this.chapters.push(chapter);
                    this.chapter_assignments[chapter] = classInfo["chapters"][chapter]["assignments"];
                    this.res = chapter.charAt(0);
                    this.link = "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/32/Letter-" + this.res + "-icon.png";
                    // this.link = "http://icons.iconarchive.com/icons/iconicon/alpha-magnets/128/Letter-"+this.res+"-icon.png";
                    this.icons_chap_map[chapter] = this.link;
                }
                //console.log(this.chapter_assignments);
                this.loading.dismiss();
            }
        })
    }

    keys(): Array<string> {
        return Object.keys(this.chapters);
    }

    openAssignmentDetailsPage(chapterTitle) {
        this.nav.push(StudentUploadPage, { chapter: chapterTitle, class: this.classSelected, studentGrade: this.student_grade, email: this.email });
    }
}
