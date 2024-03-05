const bcrypt = require('bcrypt');

function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/index');

    }else{
        res.redirect('/');
    }
}

function auth(req, res){
    const data = req.body;
    //console.log(data); ver en consola cuando llenen el login los datos
    req.getConnection((err, conn)=> {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata)=>{
            
            if(userdata.length > 0) {
               
              //console.log('hello'); ver consola cuando se ingrese con el usuario correctamente
            userdata.forEach(element => {
                bcrypt.compare(data.password, element.password, (err, isMatch) => {
                    if(!isMatch) {
                        res.render('login/index', { error: 'Error: incorrect password !'}); //usuario: pr12@gmail.com y contra:12245*
                    }else{
                        
                        req.session.loggedin = true;
                        req.session.name = element.name;

                        res.redirect('/');

                    }
                });
            });
              

            } else{
                //console.log('user already created'); ver el error de usuario ya registrado en consola
                res.render('login/index', { error: 'Error: user not exists !'});
            }
        });
    }); 
}

function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register');

    }else{
        res.redirect('/');
    }
}

function storeUser(req, res){
    const data = req.body

    req.getConnection((err, conn)=> {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata)=>{
            if(userdata.length > 0) {
                //console.log('user already created'); ver el error de usuario ya registrado en consola
                res.render('login/register', { error: 'Error: user already exists !'});
            } else{

                bcrypt.hash(data.password, 12).then(hash =>{
                    data.password = hash;
                    //console.log(data); ver los datos ingresados de los usuarios con contraseña encriptada
                    req.getConnection((err, conn)=>{
                        conn.query('INSERT INTO users SET ?', [data], (err, rows)=>{

                            req.session.loggedin = true;
                            req.session.name = data.name;

                            res.redirect('/');
                        });
                    });
                });
            }
        });
    });
}

function logout(req, res){
    if(req.session.loggedin == true){

        req.session.destroy();
    
    }
        res.redirect('/login');
}
module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
}