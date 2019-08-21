class NetworkBuilder {
    constructor(func) {
        this._method = '';
        this._data = {};
        this._func = func;
    }

    /**
     * Set method
     * @param method
     * @returns {NetworkBuilder}
     */
    method(method) {
        this._method = method;
        return this;
    }

    /**
     * Set data
     * @param data
     * @returns {NetworkBuilder}
     */
    data(data) {
        this._data = data;
        return this;
    }

    async execute() {
        return this._func(this._method, this._data, this._auth);
    }
}

module.exports = NetworkBuilder;
