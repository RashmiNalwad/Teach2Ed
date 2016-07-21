/// <reference path="../../../typings/globals/underscore/index.d.ts" />
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
import * as _ from 'underscore';
let pouch = require('pouchdb');

@Injectable()
export class Data {

    private db: any;

    constructor(private http: Http) {
        this.http = http;
        this.db = new pouch('https://teach2educate:educate2teach@teach2educate.cloudant.com/t2edb/');
        /*let remoteCouchDb = "https://teach2educate:educate2teach@teach2educate.cloudant.com/t2edb";
        this.http = http;
        //  this.remoteCouch = new pouch('http://admin:admin@192.168.0.6:5984/t2edb');
        pouch.sync(new pouch('t2edb'), new pouch(remoteCouchDb), { adapter: 'websql', location: 'default', live: true, continuous: true }).
            on('change', function(info) {
                // handle change
                console.log("on change is invoked" + info);
            }).on('paused', function() {
                // replication paused (e.g. user went offline)
                console.log("on paused is invoked");
            }).on('active', function() {
                // replicate resumed (e.g. user went back online)
                console.log("on active is invoked");
            }).on('denied', function(info) {
                // a document failed to replicate, e.g. due to permissions
                console.log("on denied is invoked" + info);
            }).on('complete', function(info) {
                // handle complete
                console.log("on complete is invoked" + info);
            }).on('error', function(err) {
                // handle error
                console.log("on error is invoked" + err);
            });*/
    }

    getDatabaseConnection() {
        if (this.db) {
            return this.db;
        } else {
            this.db = new pouch('https://teach2educate:educate2teach@teach2educate.cloudant.com/t2edb/');
            //  this.db = new pouch('t2edb', { adapter: 'websql', location: 'default' });
            //  this.db.setMaxListeners(40);
            return this.db;
        }

    }

    getUserInfo(username) {
        return new Promise(resolve => {
            this.db.get(username).then(function(doc) {
                resolve(doc);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    getStudentClassChapInfo(username) {
        return new Promise(resolve => {
            this.db.get(username).then(function(doc) {
                resolve(doc);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }
    selectClassGrp(classGrp, teacherId) {
        var dbaccess = this;
        return new Promise(resolve => {
            dbaccess.db.get(classGrp).then(function(classDoc) {
                //console.log(classDoc);
                if (classDoc.teachers.indexOf(teacherId) != -1) {
                    console.log(teacherId + " is already present in : " + classDoc._id);
                    resolve(undefined);
                } else {
                    classDoc.teachers.push(teacherId);
                    dbaccess.db.put(classDoc);
                    return dbaccess.db.get(teacherId);
                }
            }).then(function(teacherDoc) {
                if (teacherDoc === undefined) {
                    resolve(undefined);
                }
                else if (teacherDoc.class_subject.indexOf(classGrp) != -1) {
                    console.log(classGrp + " is already present in : " + teacherDoc._id);
                    resolve(undefined);
                } else {
                    teacherDoc.class_subject.push(classGrp);
                    resolve(dbaccess.db.put(teacherDoc));
                }
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    updateResponse(assignment, student, myresponse) {
        var dbaccess = this;
        return new Promise(resolve => {
            dbaccess.db.get("assignment_" + assignment).then(function(doc) {
                console.log(doc);
                doc["responses"][student] = myresponse;
                let index = doc["teacher_yet_to_review"].indexOf(student);
                if (index == -1) {
                    doc["teacher_yet_to_review"].push(student);
                }
                console.log(doc);
                resolve(dbaccess.db.put(doc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    addClassGrp(classGrp, teacherId) {
        var dbaccess = this;
        return new Promise(resolve => {
            this.db.put({
                _id: classGrp,
                chapters: {},
                students: [],
                teachers: [teacherId]
            }).then(function(response) {
                //console.log(response);
                return dbaccess.db.get(teacherId);
            }).then(function(doc) {
                doc.class_subject.push(classGrp);
                //return dbaccess.db.put(doc);
                resolve(dbaccess.db.put(doc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    getClassGrp(classGrp) {
        return new Promise(resolve => {
            this.db.get(classGrp).then(function(classDoc) {
                //console.log(classDoc);
                resolve(classDoc);
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    addChapter(chapter, classGrp) {
        var dbaccess = this;
        var chapterName = chapter;
        return new Promise(resolve => {
            this.db.get(classGrp).then(function(classDoc) {
                console.log(chapterName);
                //let chapterRecord ={};
                //chapterRecord[chapterName] = { "assignments" : [] } ;
                //classDoc.chapters.push(chapterRecord);
                classDoc.chapters[chapterName] = { "assignments": [] };
                resolve(dbaccess.db.put(classDoc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    allocateAssignmentReviews(dbaccess, studentsMap) {
        /*let studentsMap = {  "s1" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s2" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s3" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s4" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s5" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s6" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s7" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s8" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s9" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s10" : { "to_review" : [], "reviewed_by" : [] },
                            "s11" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s12" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s13" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s14" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s15" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s16" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s17" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s18" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s19" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s20" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s21" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s22" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s23" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s24" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s25" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s26" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s27" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s28" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s29" : { "to_review" : [], "reviewed_by" : [] } ,
                             "s30" : { "to_review" : [], "reviewed_by" : [] },
                            "s31" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s32" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s33" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s34" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s35" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s36" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s37" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s38" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s39" : { "to_review" : [], "reviewed_by" : [] } ,
                            "s40" : { "to_review" : [], "reviewed_by" : [] }
                          };*/
        //console.log(studentsMap);
        let no_of_peers_to_review = 3;
        let no_of_reviewers = 3;
        for (let mykey in studentsMap) {
            let peer_queue = [];
            for (let peerkey in studentsMap) {
                if (mykey == peerkey) {
                    continue;//to skip own referral scenario
                }
                if (studentsMap[peerkey]["reviewed_by"].length < no_of_reviewers) {
                    peer_queue.push(peerkey);
                }
            }
            //console.log("**********");
            //console.log(mykey);
            //console.log(peer_queue);
            let peers = (_.sample(peer_queue, no_of_peers_to_review));
            //console.log(peers);
            studentsMap[mykey]["to_review"] = peers;
            let peer: any;
            for (peer of peers) {
                //console.log(peer + " reviewed_by : " + mykey);
                studentsMap[peer]["reviewed_by"].push(mykey);
            }
        }
        //console.log(studentsMap);
        for (let mykey in studentsMap) {
            //console.log(mykey + " reviews : " + studentsMap[mykey]["to_review"].length + " peers and is reviewed_by : " + studentsMap[mykey]["reviewed_by"].length);
            if ((studentsMap[mykey]["to_review"].length != no_of_peers_to_review) || (studentsMap[mykey]["reviewed_by"].length != no_of_reviewers)) {
                console.log("Not met the desired critera for : " + mykey);
                console.log(studentsMap[mykey]["to_review"]);
                console.log(studentsMap[mykey]["reviewed_by"]);
                //console.log("Hence regenerating....");
                //dbaccess.allocateAssignmentReviews(dbaccess, studentsMap);
            }
        }
    }

    addAssignment(assignment, classGrp, chapter, description_detail, duration, assignedOnDateString, softDeadlineDateString, hardDeadlineDateString) {
        var dbaccess = this;
        var chapterName = chapter;
        var assignmentKey = "assignment_" + assignment;
        var assignmentName = assignment;

        var studentsInClass = [];
        var studentsPeerMap = {};
        return new Promise(resolve => {
            dbaccess.db.get(classGrp).then(function(classDoc) {
                studentsInClass = classDoc["students"];
                for (let student of studentsInClass) {
                    studentsPeerMap[student] = { "to_review": [], "reviewed_by": [] }
                }
                dbaccess.allocateAssignmentReviews(dbaccess, studentsPeerMap);
                //console.log("After allocateAssignmentReviews");
                //console.log(studentsPeerMap);
                dbaccess.db.put({
                    _id: assignmentKey,
                    description: description_detail,
                    max_response_duration_min: duration,
                    responses: {},
                    teacher_reviewed: [],
                    teacher_yet_to_review: [],
                    assigned_on: assignedOnDateString,
                    soft_deadline_due: softDeadlineDateString,
                    hard_deadline_due: hardDeadlineDateString,
                    peer_review_map: studentsPeerMap
                }).then(function(response) {
                    //console.log(response);
                    return (dbaccess.db.get(classGrp));
                }).then(function(classDoc) {
                    classDoc["chapters"][chapter]["assignments"].push(assignmentName);
                    resolve(dbaccess.db.put(classDoc));
                }).catch(function(err) {
                    console.log(err);
                    resolve(err);
                });
            });
        });
    }

    /*return new Promise(resolve => {
      dbaccess.db.put({
        _id: assignmentKey,
        description: description_detail,
        max_response_duration_min: duration,
        responses: {},
        teacher_reviewed: [],
        teacher_yet_to_review: [],
        assigned_on : assignedOnDateString,
        soft_deadline_due : softDeadlineDateString,
        hard_deadline_due : hardDeadlineDateString
      }).then(function (response) {
          console.log(response);
          return(dbaccess.db.get(classGrp));
      }).then(function(classDoc){
          classDoc["chapters"][chapter]["assignments"].push(assignmentName);
          resolve(dbaccess.db.put(classDoc));
      }).catch(function (err) {
          console.log(err);
          resolve(err);
      });
    });*/


    getChapters(classGrp) {
        return new Promise(resolve => {
            this.db.get(classGrp).then(function(doc) {
                resolve(doc);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    getAssignments(classGrp, chapter) {
        return new Promise(resolve => {
            this.db.get(classGrp).then(function(doc) {
                resolve(doc["chapters"][chapter]);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    getAssignmentInfo(assignment) {
        //console.log('getAssignmentInfo(' + assignment + ')')
        return new Promise(resolve => {
            this.db.get("assignment_" + assignment).then(function(doc) {
                resolve(doc);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    updateAssignmentInfo(assignment, assignmentDesc, maxResponseTime) {
        var dbaccess = this;
        return new Promise(resolve => {
            this.db.get("assignment_" + assignment).then(function(doc) {
                doc["description"] = assignmentDesc;
                doc["max_response_duration_min"] = maxResponseTime;
                resolve(dbaccess.db.put(doc));
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    getQuestions() {
        return new Promise(resolve => {
            this.db.get("review_questions").then(function(doc) {
                console.log(doc);
                resolve(doc);
            }).catch(function(err) {
                console.log(err);
            })
        });
    }

    submitPeerFeedback(assignment, reviewer, peer, feedback) {
        var dbaccess = this;
        return new Promise(resolve => {
            this.db.get("assignment_" + assignment).then(function(assignmentDoc) {
                console.log(assignmentDoc["responses"][peer]["peers_feedback"][reviewer]);
                feedback["feedback_submitted"] = true;
                assignmentDoc["responses"][peer]["peers_feedback"][reviewer] = feedback;
                console.log(assignmentDoc["responses"][peer]["peers_feedback"][reviewer]);
                resolve(dbaccess.db.put(assignmentDoc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }
    getBasicUserInfo(userId) {
        return new Promise(resolve => {
            this.db.get(userId).then(function(userDoc) {
                resolve(userDoc);
            });
        });
    }

    submitReview(assignment, student_id, teacher_reviewed, teacher_feedback) {
        var dbaccess = this;
        return new Promise(resolve => {
            this.db.get("assignment_" + assignment).then(function(assignmentDoc) {
                console.log(assignmentDoc);

                assignmentDoc["responses"][student_id]["teacher_reviewed"] = teacher_reviewed;
                assignmentDoc["responses"][student_id]["teacher_feedback"] = teacher_feedback;

                //remove student_id from teacher_yet_to_review
                let updated_teacher_yet_to_review = [];
                console.log(assignmentDoc["teacher_yet_to_review"]);
                for (let existing_student_id of assignmentDoc["teacher_yet_to_review"]) {
                    if (existing_student_id === student_id)
                        continue;
                    else
                        updated_teacher_yet_to_review.push(existing_student_id);
                }
                assignmentDoc["teacher_yet_to_review"] = updated_teacher_yet_to_review;
                console.log(assignmentDoc["teacher_yet_to_review"]);
                //add student_id to teacher_reviewed
                assignmentDoc["teacher_reviewed"].push(student_id);

                console.log(assignmentDoc);
                resolve(dbaccess.db.put(assignmentDoc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }

    deadlineUpdate(assignment, soft_deadline_due, review_peer_deadline_due, hard_deadline_due) {
        var dbaccess = this;
        return new Promise(resolve => {
            this.db.get("assignment_" + assignment).then(function(assignmentDoc) {
                //console.log(assignmentDoc);
                assignmentDoc["soft_deadline_due"] = soft_deadline_due;
                assignmentDoc["review_peer_deadline_due"] = review_peer_deadline_due;
                assignmentDoc["hard_deadline_due"] = hard_deadline_due;
                //console.log(assignmentDoc);
                resolve(dbaccess.db.put(assignmentDoc));
            }).catch(function(err) {
                console.log(err);
                resolve(err);
            });
        });
    }
}
