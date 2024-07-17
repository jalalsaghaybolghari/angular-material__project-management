import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '@models/user';
import { MaterialModule } from '@modules/Material.module';
import { UserService } from '@services/users.service';
import { map, take } from 'rxjs';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddUserComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private activatedRouter: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this._loadUser();
  }
  public pageTitle: string = 'Add User';
  public id: string | null = null;

  userForm = this.builder.group({
    firstName: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    mobile: this.builder.control('', Validators.required),
  });

  private _loadUser() {
    this.id = this.activatedRouter.snapshot.paramMap.get('id') as string;
    if (this.id != null && this.id != '') {
      this.pageTitle = 'Update User';
      this.userService
        .getUser(this.id)
        .pipe(
          take(1),
          map((user) => {
            this.userForm.setValue({
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              mobile: user?.mobile || '',
            });
          })
        )
        .subscribe();
    }
  }

  SaveUser() {
    if (this.userForm.valid) {
      const user: User = {
        firstName: this.userForm.value.firstName as string,
        lastName: this.userForm.value.lastName as string,
        email: this.userForm.value.email as string,
        mobile: this.userForm.value.mobile as string,
      };
      if (this.id == null) {
        this.userService.addUser(user).pipe(take(1)).subscribe();
      } else {
        user.id = this.id;
        this.userService.updateUser(user).pipe(take(1)).subscribe();
      }
    }
  }
}
