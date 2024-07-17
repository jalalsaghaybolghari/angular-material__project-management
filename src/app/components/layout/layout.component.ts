import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHeaderComponent } from '@components/menu-header/menu-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,MenuHeaderComponent,NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
