import { Component, OnInit, Input } from "@angular/core";
import {
  state,
  style,
  trigger,
  transition,
  animate
} from "@angular/animations";


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],

  animations: [
    trigger("animateLoading", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s", style({ opacity: 1 }))
      ]),
      transition(":leave", [animate("0.10s", style({ opacity: 0 }))])
    ])
  ]
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
