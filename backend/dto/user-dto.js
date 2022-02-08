module.exports = class userDto {
    login;
    id;
    last_sign;
    fio;

    constructor(model) {
        this.login = model.login,
        this.id = model.users_id,
        this.last_sign = model.last_sign,
        this.fio = model.fio
    }
}