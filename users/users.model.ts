import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import {TestaCPF} from '../common/validator'
import {environment} from '../common/environment'

export interface User extends mongoose.Document{
    name: string,
    email: string,
    password: string
    cpf: string,
    gender: string,
    matches(password: string): boolean

}

export interface UserModel extends mongoose.Model<User>{
    findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:80,
        minlength:3,
    },
    email:{
        type:String,
        unique: true,
        required:true
    },
    password:{
        type:String,
        select: false,
        required:true
    },
    gender:{
        type:String,
        required:false,
        enum:['Male','Female']
    },
    cpf: {
        type: String,
        required: false,
        validate:{
            validator:TestaCPF,
            message:'{PATH}: Invalid CPF ({VALUE})'
        }
    }
})
userSchema.statics.findByEmail = function(email: string, projection: string){
    this.findOne({email})
}

userSchema.methods.matches = function(password: string): boolean{
    return bcrypt.compareSync(password,this.password)
}


const hashPassword = (obj, next) =>{
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
        obj.password = hash
        next()
    }).catch(next)
}

const saveMiddleware = function(next){
    const user : User = this
    if(!user.isModified('password')){
        next()
    }else{
        hashPassword(user,next)
    }
}

const updateMiddleware =  function(next){
    if(!this.getUpdate().password){
        next()
    }else{
        hashPassword(this.getUpdate(),next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)


export const User = mongoose.model<User,UserModel>('User',userSchema)