import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { AngularFirestore } from "@angular/fire/firestore";
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage {

  public productlist = [];
  public isLoading: any;
  

  constructor(private toastservice: ToastService,
    public ngroute: Router,
    private fbstore: AngularFirestore,
    public alertcontrol: AlertController,
    private fbauth: AngularFireAuth) {}

  async getProducts(){
    try{
      await this.fbstore.collection("tasks").snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.productlist = data.map(result => {
          //console.log(result)
          
          return {
            docid: result.payload.doc.id,
            producttitle: result.payload.doc.data()["pt"],
            productdesc: result.payload.doc.data()["pd"],
            productpriority: result.payload.doc.data()["pp"],
            createdAt: result.payload.doc.data()["pdate"]
          }

        });

        /* remove later only for delaying loading of products list to show animation for a longer duration */
        of(data).pipe(
          delay(1000)
        ).subscribe((data) => {this.isLoading = false;});

      });
    }catch(error){
      this.toastservice.showToast(error.message, 2000);
      //console.log(error.message);
    }
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.getProducts();
  }

  async deleteConfirmproduct(docid: string) {
    const alert = await this.alertcontrol.create({
      cssClass: 'alt',
      header: 'Confirm Delete',
      message: 'Are you sure you want delete this ' + docid +  ' task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.fbstore.doc("tasks/" + docid).delete().then(data => {
              this.ngroute.navigate(['home']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async doLogout(): Promise<void> {
    await this.fbauth.signOut().then(() => {
      // this.ngroute.navigate(['login']);
    });
  }

}
