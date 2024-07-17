import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { User } from '@models/user';
import { UserInput } from '@models/user-input';
import { MaterialModule } from '@modules/Material.module';
import { UserService } from '@services/users.service';
import { map, take } from 'rxjs';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public userDate!: User[];
  public dataSource: any;
  public displayColumns: string[] = ['code', 'name', 'email', 'phone', 'actions'];
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadInitData();
  }
  private loadInitData() {
    const userInput = new UserInput();
    this.userService.getUsers(userInput).pipe(take(1), map((users) => {this.userDate = users;
      this.dataSource = new MatTableDataSource(this.userDate);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;})).subscribe();
  }

}
