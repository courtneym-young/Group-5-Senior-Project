// For now im passing this with props. Redux might come later 

import { AuthUser } from 'aws-amplify/auth';

export interface UserData {
    user: AuthUser
}
