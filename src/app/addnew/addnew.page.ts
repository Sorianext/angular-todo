import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { AngularFirestore } from "@angular/fire/firestore";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.page.html',
  styleUrls: ['./addnew.page.scss'],
  providers: [DatePipe]
})
export class AddnewPage implements OnInit {

  addnewform: FormGroup;
  constructor(public addnewFormbuilder: FormBuilder,
    private toastservice: ToastService,
    public ngroute: Router,
    private datePipe: DatePipe,
    private fbstore: AngularFirestore) {
    this.addnewform = this.addnewFormbuilder.group({
      producttitle: ['', [Validators.required, Validators.minLength(6)] ],
      productpriority: ['', [Validators.required, Validators.minLength(2)] ],
      productdesc: ['', [Validators.required, Validators.minLength(6)] ]
    })
  }

  ngOnInit() {
  }

  async doAddnew() {
    var date = new Date();
    let productobj = {
      pt: this.addnewform.get('producttitle').value,
      pd: this.addnewform.get('productdesc').value,
      pp: this.addnewform.get('productpriority').value,
      pdate: this.datePipe.transform(date, 'yyyy-MM-dd')
    }
    try{
      await this.fbstore.collection("tasks").add(productobj).then(data => {
        console.log(data);
        this.ngroute.navigate(['home']);
      })
    }catch(error){
      this.toastservice.showToast(error.message, 2000);
      //console.log(error.message);
    }
  }

}
