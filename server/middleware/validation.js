const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateGameSession = (req, res, next) => {
  const schema = Joi.object({
    score: Joi.number().min(0).required(),
    levelReached: Joi.number().min(1).max(5).required(),
    wpm: Joi.number().min(0).required(),
    accuracy: Joi.number().min(0).max(100).required(),
    wordsTyped: Joi.number().min(0).required(),
    durationSeconds: Joi.number().min(0).required(),
    gameMode: Joi.string().valid('normal', 'boss_battle', 'practice').default('normal'),
    gameStats: Joi.object({
      enemiesDefeated: Joi.number().min(0).default(0),
      bossesDefeated: Joi.number().min(0).default(0),
      alliesHelped: Joi.number().min(0).default(0),
      livesLost: Joi.number().min(0).default(0)
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateGameSession
};