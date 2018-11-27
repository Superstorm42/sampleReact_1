const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    }
})

userSchema.pre('save', (next)=>{
    let user = this;
    console.log('working.');
    console.log('pass:'+user.password);
    bcrypt.genSalt(10, (err, salt) => {
        console.log(user.password);
        console.log('Salt=' + salt);
        if (err)
            return next(err);
        
        bcrypt.hash(user.password, salt, (err, hash) => {
            console.log('err'+err);
            if (err)
                return next(err);
            console.log('HASH:' + hash);
            user.password = hash;
            next();
        })
    })

})

userSchema.methods.comparePass = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword,this.password,function(err,IsMatch){
        if(err)
            throw cb(err);
        cb(null,IsMatch);
    });
};
const User = mongoose.model('User', userSchema);
module.exports = { User };          