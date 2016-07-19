import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Data } from '../../providers/data/data';

/*
  Generated class for the ClassService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ClassService {

    db: any;

    static get parameters() {
        return [[Http], [Data]]
    }

    constructor(private http: Http, private data: Data) {
        this.data = data;
        this.db = data.getDatabaseConnection();
        //console.log(this.db);
    }

    loadClass() {
        return new Promise(resolve => {
            this.db.get('classes').then((result) => {
                resolve(result.classes);
            }).catch((err) => {
                console.log('DB retrieval issue' + err);
            });
        });
    }

    loadClassesInfo() {
        return new Promise(resolve => {
            this.db.get('classInfo').then((result) => {
                resolve(result.classes);
            }).catch((err) => {
                console.log('DB retrieval issue' + err);
            });
        });
    }

    addClass(className, spl, sub){
      var obj = this;
      return new Promise(resolve => {
          this.db.get('classInfo').then((result) => {
              if(className in result.classes){
                if(spl in result.classes[className]){
                  if(result.classes[className][spl].indexOf(sub) != -1){
                    console.log("subject already exists");
                    resolve(undefined);//subject already exists
                  }else{
                    console.log("new subject");
                    console.log("adding : " + sub + " to " + result.classes[className][spl]);
                    result.classes[className][spl].push(sub);
                  }
                }else{//new specialization
                  console.log("new specialization");
                  console.log("adding : " + spl + " to " + Object.keys(result.classes[className]));
                  result.classes[className][spl] = [sub];
                }
              }else{//new class
                console.log("Adding a New class");
                let specialization = {}
                specialization[spl] = [sub];
                result.classes[className] = specialization;
                //console.log("adding : " + className + " to " + Object.keys(result.classes));
              }
              resolve(obj.db.put(result));
          }).catch((err) => {
              console.log('DB retrieval issue' + err);
          });
      });
    }


}
