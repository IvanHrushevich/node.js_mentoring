export class HttpError {
    status: number;
    title: string;
    detail: any;

    constructor(status: number, title: string = '', detail: any = '') {
        this.status = status;
        this.title = title;
        this.detail = detail;
    }
}
