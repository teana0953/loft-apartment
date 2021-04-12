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
    photo?: ArrayBuffer;
    passwordConfirm: string;
}

export interface ISignupGoogle {
    email: string;
    name: string;
    googleIdToken: string;
}

/**
 *
 */
class AuthHelper extends ApiHelper<IUrl> {
    constructor() {
        super();
        this.Url = {
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
                url: this.Url.login,
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
        return new Observable<IResponseBase<IUser.IUser>>((observer) => {
            let sub = AxiosService.http$({
                url: this.Url.signup,
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
     * signup google
     * @param data
     * @returns
     */
    public signupGoogle$(data: ISignupGoogle) {
        return new Observable<IResponseBase<IUser.IUser>>((observer) => {
            let sub = AxiosService.http$({
                url: this.Url.signupGoogle,
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
     * logout
     */
    public logout$() {
        return new Observable<Date>((observer) => {
            let sub = AxiosService.http$({
                url: this.Url.logout,
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
     * check auth
     */
    public checkAuth$() {
        return new Observable<Date>((observer) => {
            let sub = AxiosService.http$({
                url: this.Url.checkAuth,
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
}

export const AuthService = new AuthHelper();