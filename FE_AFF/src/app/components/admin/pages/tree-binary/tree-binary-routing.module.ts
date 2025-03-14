
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TreeBinaryComponent } from './tree-binary.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: TreeBinaryComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class TreeBinaryRoutingModule { }
