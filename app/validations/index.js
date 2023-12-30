exports.validate = (fieldName, rules, isParam = false, customFunctions = null) => {
    const { isArray, isFunction, isNumber, get } = require('lodash');
    const { body, check } = require('express-validator');
    let obj;
    const splittedRules = rules.replace(/\s/g, '').split('|');

    if (Boolean(fieldName) && (isArray(splittedRules) && splittedRules.length)) {
        obj = isParam ? check(fieldName) : body(fieldName);

        for (const rule of splittedRules) {
            switch (rule) {
                case ('optional'):
                    obj = obj.optional();
                    break;
                case ('optional:null'):
                    obj = obj.optional({ nullable: true });
                    break;
                case ('string'):
                    obj = obj.isString().withMessage(`${fieldName} must be type string!`).bail()
                    break;
                case ('sanitizedString'):
                    obj = obj.isString().escape().trim().withMessage(`${fieldName} must be type string!`).bail()
                    break;
                case ('integer'):
                    obj = obj.isInt().withMessage(`${fieldName} must be type integer!`).bail();
                    break;
                case ('positive'):
                    obj = obj.isInt({ min: 0 }).withMessage(`${fieldName} must be type positive integer!`).bail();
                    break;
                case ('array'):
                    obj = obj.isArray().withMessage(`${fieldName} must be type array!`).bail();
                    break;
                case ('arrayNotEmpty'):
                    obj = obj.isArray({ min: 1 }).withMessage(`${fieldName} must be type array and can't be empty!`).bail();
                    break;
                case ('object'):
                    obj = obj.isObject().withMessage(`${fieldName} must be type object!`).bail();
                    break;
                case ('boolean'):
                    obj = obj.isBoolean().withMessage(`${fieldName} must be type boolean!`).bail();
                    break;
                case ('email'):
                    obj = obj.isEmail().withMessage(`${fieldName} must be formatted to a valid email!`).bail();
                    break;
                case ('alpha'):
                    obj = obj.isAlphanumeric().withMessage(`${fieldName} must consist of alphanumeric character only!`).bail();
                    break;
                case ('alphaChar'):
                    obj = obj.matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_+=\-[\]\\/'~` ]*$/).withMessage(`${fieldName} must consist of alphanumeric and special characters!`).bail();
                    break;
                case ('alphaCharStrict'):
                    obj = obj.matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$/).withMessage(`${fieldName} must consist of minimum 1 lowercase, 1 uppercase, 1 special character, and 1 number!`).bail();
                    break;
                case ('mobilePhone'):
                    obj = obj.isMobilePhone('id-ID').withMessage(`${fieldName} must be formatted to a valid phone number!`).bail();
                    break;
                case ('date'):
                    obj = obj.isISO8601().toDate().withMessage(`${fieldName} must be formatted to a valid date!`).bail();
                    break;
                case ('notEmpty'):
                    obj = obj.not().isEmpty().withMessage(`${fieldName} can't be empty!`).bail();
                    break;
                case ('float'):
                    obj = obj.isFloat().withMessage(`${fieldName} must be decimal!`).bail();
                    break;
                case ('optional:falsy'):
                    obj = obj.optional({ checkFalsy: true });
                    break;
                case ('required'):
                    obj = obj.exists().withMessage(`${fieldName} is required!`).bail();
                    break;
                case ('requiredNotEmpty'):
                    obj = obj.exists().not().isEmpty().withMessage(`${fieldName} is required and cannot be empty!`).bail();
                    break;
                case ('dateonly'):
                    obj = obj.isDate({ format: 'YYYY-MM-DD' }).withMessage(`${fieldName} must be formatted to YYYY-MM-DD`).bail();
                    break;
                case ('url'):
                    obj = obj.trim().isURL({
                        protocols: ["http", "https"],
                        require_tld: true,
                        require_protocol: true,
                        require_host: true
                    }).withMessage(`${fieldName} must be an URL!`).bail();
                    break;
                default:
                    // only support 1 parameter
                    if (rule.search('requiredIfExists:') !== -1) {
                        const splittedObject = rule.split(':');
                        const otherParams = splittedObject[1];

                        obj = obj.if((isParam ? check(otherParams) : body(otherParams)).exists())
                            .exists()
                            .withMessage(`${fieldName} is required if ${otherParams} exists!`)
                            .bail();
                    } else if (rule.search('requiredIfValue:') !== -1) {
                        // only support 1 parameter
                        const splittedObject = rule.split(':');
                        const params = splittedObject[1].split(',');
                        const isArray = params.length > 2 ? true : false;

                        obj = (isArray ?
                            obj.if((isParam ? check(params[0]) : body(params[0])).isIn(params.slice(1))) :
                            obj.if((isParam ? check(params[0]) : body(params[0])).equals(params[1])))
                            .exists()
                            .withMessage(`${fieldName} is required if ${params[0]} value is ${params.slice(1)}!`)
                            .bail();
                    } else if (rule.search('requiredIfOthersEmpty:') !== -1) {
                        // TODO still error, not working as intended
                        // only support 1 request body
                        const splittedObject = rule.split(':');
                        (splittedObject[1].split(',')).map(parameterMustBeFilled => {
                            obj = body(parameterMustBeFilled)
                                .custom((mustBeFilledValue, { req, location, path }) => {
                                    const parentEmptyValue = isArray(get(req.body, fieldName)) ? get(req.body, fieldName).length == 0 : Boolean(get(req.body, fieldName));
                                    if (isArray(mustBeFilledValue)) {
                                        if (mustBeFilledValue.length == 0 && parentEmptyValue) {
                                            throw new Error(`${fieldName} cannot be empty if ${splittedObject[1]} is empty!`);
                                        }
                                    }

                                    if (!(Boolean(mustBeFilledValue)) && parentEmptyValue) {
                                        throw new Error(`${fieldName} cannot be empty if ${splittedObject[1]} is empty!`);
                                    }

                                    return true;
                                })
                                .bail();
                        });
                    } else if (rule.search("intMin:") !== -1) {
                        const splittedObject = rule.split(':');
                        const min = Number(splittedObject[1]);

                        if (isNumber(min)) {
                            obj = obj.isInt({ min: min }).withMessage(`${fieldName} must be larger than ${min}!`)
                        }
                    } else if (rule.search("min:") !== -1) {
                        const splittedObject = rule.split(':');
                        const min = Number(splittedObject[1]);

                        if (isNumber(min)) {
                            obj = obj.isLength({ min }).withMessage(`${fieldName} can't be less than ${min} characters!`);
                        }
                    } else if (rule.search("max:") !== -1) {
                        const splittedObject = rule.split(':');
                        const max = Number(splittedObject[1]);

                        if (isNumber(max)) {
                            obj = obj.isLength({ max }).withMessage(`${fieldName} can't be more than ${max} characters!`);
                        }
                    } else if (rule.search("inside:") !== -1) {
                        const splittedObject = rule.split(':');
                        const splittedObjectRules = splittedObject[1]?.split(',');

                        if (isArray(splittedObjectRules) && splittedObjectRules.length > 0 && Boolean(splittedObjectRules[0])) {
                            obj = obj.isIn(splittedObjectRules).withMessage(`${fieldName} must be inside of ${splittedObjectRules}!`).bail()
                        }
                    } else if (rule === 'custom' && isArray(customFunctions)) {
                        for (const customFunction of customFunctions) {
                            if (isFunction(customFunction))
                                obj = obj.custom(customFunction).bail();
                        }
                    }
            }
        }
    }

    return obj;
}