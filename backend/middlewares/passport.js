const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BeeAuth = require('../models/beeAuth');
const Bees = require('../models/bee');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'beemee'
}

//ユーザー名とパスワードによる認証
passport.use(new LocalStrategy({usernameField: 'beeId', passwordField: 'password'}, async (beeId, password, done) => {
    try {
        const beeAuth = await BeeAuth.findOne({ where : { beeId }});
        if (!beeAuth) return done(null, false, { message : 'Bee Not Found' });

        const isMatch = await bcrypt.compare(password, beeAuth.password);
        if (!isMatch) return done(null, false, { message : 'Incorrect password: パスワード認証に失敗しました'});

        const bee = await Bees.findOne({ beeId },'_id beeId beeName');
        if(!bee) return done(null, false, { message: 'Bee Not Found'});

        return done(null, bee);

    } catch (err) {
        return done(err,false,{ message : 'Error occured' });
    }
}));

//JWTによる認証
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        
        const bee = await Bees.findOne({ beeId: jwt_payload.beeId },'_id beeId').exec();

        if (!bee) return done(null, false, { message: 'Unauthorized: JWT認証に失敗しました' });

        return done(null,bee);

    } catch (err) {
        return done(err, false, { message: 'Internal Server Error' });
    }
}));

passport.serializeUser((bee, done) => {
    done(null, bee);
});

passport.deserializeUser((bee, done) => {
    done(null, bee);
});

/**
 * ログイン処理
 */
const authenticateLocal = async (req, res, next) => {
    passport.authenticate('local', { session : false }, (err, bee) => {
        if (err) return next(err);
        if (!bee) return res.status(401);
        req.bee = bee;
        next();
    })(req, res, next);
}

/**
 * 認証必須処理用の認証処理
 */
const authenticateJwt = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, bee) => {
        if (err) return next(err);
        if (!bee) return res.status(401);
        req.bee = bee;
        next();
    })(req, res, next);
}

/**
 * 任意認証用の認証処理
 */
const troughtJwt = async (req, res, next) => {
    passport.authenticate('jwt', { session : false }, (err, bee) => {
        if (err) return next(err);
        if (bee) req.bee = bee;
        return next();
    })(req, res, next);
}

const generateJwt = (bee) => {
    const payload = { beeId : bee.beeId };
    return jwt.sign(payload, opts.secretOrKey, {expiresIn: '7d'});
}

module.exports = {
    authenticateLocal,
    authenticateJwt,
    troughtJwt,
    generateJwt,
}