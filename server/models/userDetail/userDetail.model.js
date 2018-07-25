let data = require('./../../config/db');
let sequelize = data.sequelize;
let connection = data.connection;

module.exports=function(){
    let user= connection.define('user_detail',{
            id: {
                type: sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            password: {
                type: sequelize.TEXT,
                allowNull: false
            },
            twitter_handle: {
              type: sequelize.JSONB
            },
            status:{
                type:sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:true
            }
        },
    );

    user.getUserByCredential =  function(models, userName, cb){

        // let userDetail= models.user_detail;
        // let user={};
        // let login=false;
        // let userId;
        //
        // userDetail.findOne({attributes:['id', 'username', 'name', 'password'],
        //     where: {username: userName, status:true}
        //      }).then((result)=> {
        //         if(result){
        //             user.login=true;
        //             userId= result.dataValues.id;
        //             user.id= userId;
        //             user.username= result.dataValues.username;
        //             user.name= result.dataValues.name;
        //             user.password= result.dataValues.password;
        //             this.getUserRole(models, userId, function(role){
        //                 user.role=role;
        //                 cb(null,user);
        //             })
        //         }
        //         else{
        //             user.login=false;
        //             cb(null, null);
        //         }
        //      }).catch(function(error){
        //             console.log(error);
        //             cb(error);
        //     });
    }
    return user;
};
