import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {

 
  modelId: number;
  private paramSubscriber: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramSubscriber = this.route.params.subscribe(params => {
      this.modelId = params['id'];
    });
  }

  ngOnDestroy(): void {
    this.paramSubscriber.unsubscribe();
  }

}
