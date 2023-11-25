const BeeAuth = require("../models/beeAuth");

exports.checkDuplicateBee = async (req,res) => {
  //次へボタンを押したときに発動する
  //入力したbeeidが他のbeeidと重複する場合(selectで検索を掛けたときにヒットした場合)は
  //false409
  //違う場合(重複がない場合)
  //true200

  const bodyInfo = req.body.info;

  try {
    const duplicate = await BeeAuth.findOne({ where: { info:bodyInfo} });

    if (duplicate) {
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(false);
  }
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