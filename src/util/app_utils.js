
var jwt = require('jsonwebtoken');

exports.reponseSuccess = function(success){
    return {
        status: true,
        data : success,
        msg: "Success!"
    }
}

exports.reponseError = function(message){
    return {
        status: false,
        data : null,
        msg: message
    } 
}

// Result {
//     formatter: [Function: formatter],
//     errors: [
//       {
//         value: '12345',
//         msg: 'Password is not valid',
//         param: 'pass',
//         location: 'body'
//       },
//       {
//         value: '12345',
//         msg: 'Re-password is not valid',
//         param: 're_pass',
//         location: 'body'
//       }
//     ]
//   }
exports.reponseErrorWithValid = function(result){
    return {
        status: false,
        data : null,
        msg: result.errors[0].msg
    } 
}

exports.generateToken = (payload, secretSignature, tokenLife, callback) => {
	return jwt.sign(
        {
            payload,
        },
        secretSignature,
        {
            algorithm: 'HS256',
            expiresIn: tokenLife,
        },
        callback
    );
};