const BeeAuth = require("../models/beeAuth");

exports.registerBee = async (req,res) => {
  //beeid
  //hash(password + salt);
  //salt
  //email
  //それぞれをsaveする。200
}

exports.checkDuplicateBee = async (req,res) => {
  //次へボタンを押したときに発動する
  //入力したbeeidが他のbeeidと重複する場合(selectで検索を掛けたときにヒットした場合)は
  //false409
  //違う場合(重複がない場合)
  //true200
}

exports.authBee = async (req,res) => {
  //もしハッシュ化させたパスワードと入力したパスワードのハッシュ値が一緒なら
  //sessionのbeeidにBeeAuth.beeidを保存200

  //違う場合は409errorでもう一度ログインさせる
}

exports.logoutBee = async (req,res) => {

}

exports.deleteBee = async (req,res) => {
  
}