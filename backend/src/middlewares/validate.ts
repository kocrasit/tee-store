import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

type Schemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);

      // Express 5: req.query is a getter-only property at runtime, so we MUST NOT reassign it.
      // Instead, mutate the underlying object.
      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params) as any;
        Object.assign(req.params as any, parsedParams);
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query) as any;
        const currentQuery = req.query as any;
        // Replace keys (keep same object reference)
        for (const key of Object.keys(currentQuery)) delete currentQuery[key];
        Object.assign(currentQuery, parsedQuery);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}


