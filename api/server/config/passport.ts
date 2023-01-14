import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { userRepository } from "../../appDataSource";

let opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const userOnDb = await userRepository.findOneBy({ id: jwt_payload.id });

      if (!userOnDb) {
        return done(null, false);
      }
      return done(null, userOnDb);
    } catch (err) {
      return done(err, false);
    }
  })
);
