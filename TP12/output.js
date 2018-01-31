var db = function db() {
    return {
        getDBName: function () {
            return 'MySQL';
        },
        getData: function () {
            return [
                {
                    user: 'alexandre',
                    password: 'javascript'
                },
                {
                    user: 'terra',
                    password: 'euamojava'
                }
            ];
        }
    };
};
console.log('Usando banco de dados: ', db().getDBName());