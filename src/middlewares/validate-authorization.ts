import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";

export const validateAuthorization = async (ctx: Context, next: Next) => {
  const authHeader = ctx.req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Unauthorized: Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    // ctx.state.user = decoded; // Store decoded user data for access in subsequent handlers
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new HTTPException(401, {
        message: "Unauthorized: Invalid or expired token",
      });
    } else {
      throw new HTTPException(500, { message: "Internal Server Error" }); // Handle unexpected errors
    }
  }

  await next();
};
