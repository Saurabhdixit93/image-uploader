module.exports.notFound = (req ,res) => {
    return res.render('404',{
        title: '404 Page Not Found'
    });
};

