import { AxiosService } from '@/helper';
import { ApiHelper } from '.';
import { Observable } from 'rxjs';
import { IResponseBase, IUser } from '@/models';

interface IUrl {
    login: string;
    logout: string;
    signup: string;
    signupGoogle: string;
    checkAuth: string;
    forgotPassword: string;
    resetPassword: string;
    updateMyPassword: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ISignup extends ILogin {
    name: string;
    photo?: File;
    passwordConfirm: string;
}

export interface ISignupGoogle {
    email: string;
    name: string;
    googleIdToken: string;
}

export interface ISignupWithToken {
    id: string;
    name: string;
    email: string;
}

/**
 *
 */
class AuthHelper extends ApiHelper<IUrl> {
    constructor() {
        super();
        this.urls = {
            login: '/login',
            logout: '/logout',
            signup: '/signup',
            signupGoogle: '/signup-google',
            checkAuth: '/check-auth',
            forgotPassword: '/forgot-password',
            resetPassword: '/reset-password', // need resetPasswordToken
            updateMyPassword: '/update-my-password',
        };
    }

    /**
     * login
     */
    public login$(data: ILogin) {
        return new Observable<IResponseBase<IUser.IUser>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.login,
                method: 'post',
                data: data,
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IUser> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    let user = data.data;
                    observer.next({
                        status: data.status,
                        token: data.token,
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            photoUrl: user.photoUrl,
                        },
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     * signup
     * @param data
     * @returns
     */
    public signup$(data: ISignup) {
        let bodyFormData = new FormData();
        bodyFormData.append('name', data.name);
        bodyFormData.append('email', data.email);
        bodyFormData.append('password', data.password);
        bodyFormData.append('passwordConfirm', data.passwordConfirm);
        bodyFormData.append('photo', data.photo);

        return new Observable<IResponseBase<IUser.IUser>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.signup,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: bodyFormData,
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IUser> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    let user = data.data;
                    observer.next({
                        status: data.status,
                        token: data.token,
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            photoUrl: user.photoUrl,
                        },
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error.response.data);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     * signup google
     * @param data
     * @returns
     */
    public signupGoogle$(data: ISignupGoogle) {
        return new Observable<IResponseBase<IUser.IUser>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.signupGoogle,
                method: 'post',
                data: data,
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IUser> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    let user = data.data;
                    observer.next({
                        status: data.status,
                        token: data.token,
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            photoUrl: user.photoUrl,
                        },
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error.response.data);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     * logout
     */
    public logout$() {
        return new Observable<Date>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.logout,
                method: 'get',
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: Date = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    observer.next(data);
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error.response.data);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     * check auth
     */
    public checkAuth$() {
        return new Observable<Date>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.checkAuth,
                method: 'get',
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: Date = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    observer.next(data);
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     * get info by token
     * @param token
     */
    public getInfoByToken$(token: string) {
        return new Observable<ISignupWithToken>((observer) => {
            let sub = AxiosService.http$({
                url: `${this.urls.signup}/${token}`,
                method: 'get',
            }).subscribe({
                next: (response) => {
                    let data: ISignupWithToken = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    observer.next({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error.response.data);
                },
            });

            return () => sub.unsubscribe();
        });
    }
}

export const AuthService = new AuthHelper();
