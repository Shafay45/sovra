import { Context, Next } from "hono";
import env from "./../constants/environment";
import { HTTPException } from "hono/http-exception";

const refererMiddleware = async (ctx: Context, next: Next) => {
  const referer = ctx.req.header("referer");
  if (!referer || !env.WHITE_LIST.includes(referer)) {
    throw new HTTPException(403, { message: "You will get banned" });
  }

  await next();
};

export default refererMiddleware;
