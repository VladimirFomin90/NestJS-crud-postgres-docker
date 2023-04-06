import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
    login() {}

    signUp() {
        return { message: 'I am sign Up' };
    }

    signIn() {
        return { message: 'I am sign In' };
    }
}
