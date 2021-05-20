exports.getLogin = (req, res, next) => {
    console.log(req.session)
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true
    res.redirect('/')
};

exports.postLogout = (req, res, next) => {
    //clear out session
    req.session.destroy((err) => {
        if(err) console.error(err)
        //session cookie on browser still exists but wont be valid because we have removed session from our db. It will be removed when browser is closed. No worries.
        res.redirect('/')
    })
};
