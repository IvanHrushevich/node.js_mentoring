import { User } from './user.model';

export interface UserCreateRequest extends User {
    groups: string[];
}
