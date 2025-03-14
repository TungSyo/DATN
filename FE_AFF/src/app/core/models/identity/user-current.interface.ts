import { User } from '../user.model';

export interface UserCurrent extends User {
    roleNames: string[];
}
