var env = process.env.NODE_ENV || 'development';
// console.log('env *******', env);

if (env === 'development' || env === 'test'){
    var config = require('./config.json');
    // console.log(config);

    var envConfig = config[env]; //If you want a variable to access an object property, you have to use bracket notation.
    // console.log(envConfig);
    Object.keys(envConfig).forEach((key) =>{
        process.env[key] = envConfig[key];
    });
}
