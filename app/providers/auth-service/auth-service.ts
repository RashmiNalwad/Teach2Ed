import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Data} from '../../providers/data/data';


let bcrypt = require('bcryptjs');

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

    private db: any;
    private userInfo: any;
    private user: any;
    static get parameters() {
        return [[Http], [Data]]
    }

    constructor(private http: Http, private data: Data) {
        this.data = data;
        this.db = data.getDatabaseConnection();
        //console.log("getting the db" + this.db);
    }

    loginUser(username, password) {

        let userflag = "false";


        return new Promise(resolve => {

            this.db.get('users', { conflicts: true }).then((result) => {
                //console.log(result);
                for (var i = 0; i < result.users.length; i++) {
                    this.user = result.users[i];

                    //console.log(this.user.userId + " " + this.user.userPassword);

                    if (username == this.user.userId) {
                        //console.log('inside the brycrt logic');
                        if (bcrypt.compareSync(password, this.user.userPassword)) {
                            //console.log('match found');
                            userflag = "true";
                        } else {
                            userflag = "false";
                            //console.log('no match');
                        }
                        break;
                    }

                }

                if (userflag == "true") {
                    // console.log('user found'+user);
                    resolve(this.user);
                    return this.user;

                } else {
                    resolve();
                    return false;

                }

            }).catch((err) => {
                console.log(err);
            });

        });
    }

    loginOut(userInfo) {
        console.log('inside the log out function');
        return new Promise(resolve => {
            this.userInfo = null;
            resolve(this.userInfo);
            return null;
        });
    }

    registerUser(formData) {
        var DB_NAME = 'users';
        let userInfos = [];
        let firstTime = false;
        let finalResult;
        let flag = false;
        let user = null;

        var obj = this;

        //console.log('inside the first time flag' + formData);
        return new Promise(resolve => {
            console.log(DB_NAME);
            obj.db.get(DB_NAME).then((result) => {
                //console.log('inside the db get method');
                userInfos = result.users;
                for (var i = 0; i < userInfos.length; i++) {
                    obj.user = userInfos[i];
                    //console.log(formData.userId + formData.userPassword);
                    //console.log(this.user.userId);

                    if ((obj.user != null) && (formData.userId === obj.user.userId)) {
                        flag = true;
                        break;
                    }
                }
                //console.log(flag);
                if (flag) {
                    resolve();
                    return false;
                } else {
                    //console.log('inside the else block and flag is false'+formData.userId);
                    if (formData.type == "teacher") {
                        let teacherId = "teacher_" + formData.userId;
                        obj.db.put({
                            _id: teacherId,
                            first_name: formData.fname,
                            last_name: formData.lname,
                            gender: formData.gender,
                            class_subject: []
                        })
                    }
                    if (formData.type == "student") {
                        let studentId = formData.userId;
                        let mySubjects = [];
                        for (let subject of formData.selectedSubjects) {
                            let className = formData.classGrade + "_" + subject;
                            mySubjects.push(className);
                            obj.db.get(className).then(function(classDoc) {
                                if (classDoc.students.indexOf(studentId) != -1) {
                                    console.log("Ideally shouldnt happen!!!!!");
                                } else {
                                    classDoc.students.push(studentId);
                                    obj.db.put(classDoc);
                                }
                            });
                        }
                        console.log(mySubjects);
                        obj.db.put({
                            _id: studentId,
                            first_name: formData.fname,
                            last_name: formData.lname,
                            gender: formData.gender,
                            subjects: mySubjects
                        });


                    }
                    userInfos.push(formData);
                    return obj.db.put({ _id: result._id, users: userInfos, _rev: result._rev }).then((doc) => {
                        //console.log("inserting into the doc" + doc);
                        firstTime = true;
                        resolve(doc);
                    }).catch((err) => {
                        console.log("error has occured");
                        console.log(err);
                    });

                }
            }).catch((err) => {
                console.log('Inside the catch block');
                console.log(err);
                userInfos.push(obj.user);
                let userDoc = {
                    _id: DB_NAME,
                    users: userInfos
                };
                console.log(firstTime);
                if (!firstTime) {
                    return obj.db.put(userDoc).then((result) => {
                        console.log('inside the catch block');
                        resolve(result);
                    }).catch((error) => {
                        console.log('error in catch block' + error);
                    });
                    // firstTime = "true";
                }

            });
        });

    }

}
