const ErrCont = {}

// This function is designed to test error handling in the application.
ErrCont.throwError = function () {
    if (true){
        throw new Error()
    }

    return { message: 'This would be returned if the error did not exist' }
}


module.exports = ErrCont