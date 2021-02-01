class Validation {

  static trimsRequestBody(req, res, next) {
    // trim body values
    if (req.body) {
      Object.keys(req.body).forEach((k) => {
        const value = req.body[k];
        if ((typeof value === 'string' || value instanceof String)
        && value !== undefined) req.body[k] = req.body[k].trim();
      });
    }
    next();
  }

  static checkBodyContains(...params) {
    return (req, res, next) => {
      for (const p of params) {
        if (req.body[p] === undefined || req.body[p] === '') {
          return res.status(400).send({
            message: `${p} cannot be missing in the body!`,
            success: false
          });
        }
      }
      next();
    };
  }

  static confirmEmail(req, res, next) {
    // checks if the email entered is valid
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email) === false) {
      return res.status(406).send({
        message: 'Please enter a valid email',
        success: false
      });
    }
    return next();
  }
}

export default Validation;
