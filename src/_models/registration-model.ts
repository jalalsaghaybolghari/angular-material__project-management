import { User } from "./user";

export class RegistrationModel extends User {
    password: string | null;

    constructor() {
      super();
      this.password = null
    }
  }