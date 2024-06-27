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
        const bee = await BeeAuth.findOne({ where : { beeId }});
        if (!bee) return done(null, false, { message : 'Bee Not Found' });

        const isMatch = await bcrypt.compare(password, bee.password);
        if (!isMatch) return done(null, false, { message : 'Incorrect password'});

        return done(null, bee);

    } catch (err) {
        return done(err,false,{ message : 'Error occured' });
    }
}));

//JWTによる認証
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        
        const bee = await Bees.findOne({ beeId: jwt_payload.beeId },'_id beeId').exec();

        if (!bee) return done(null, false, { message: 'Unauthorized' });

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

const authenticateLocal = async (req, res, next) => {
    passport.authenticate('local', { session : false }, (err, bee) => {
        if (err) return next(err);
        if (!bee) return res.status(401);
        req.bee = bee;
        next();
    })(req, res, next);
}

const authenticateJwt = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, bee) => {
        if (err) return next(err);
        if (!bee) return res.status(401);
        req.bee = bee;
        next();
    })(req, res, next);
}

const generateJwt = (bee) => {
    const payload = { beeId : bee.beeId };
    return jwt.sign(payload, opts.secretOrKey, {expiresIn: '7d'});
}

module.exports = {
    authenticateLocal,
    authenticateJwt,
    generateJwt,
}