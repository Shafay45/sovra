import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import { Context } from "hono";

export const setUserCookie = async (user: any, cx: Context) => {
  let token = await generateToken(user);

  setCookie(cx, "sovra", token, {
    secure: true,
    httpOnly: true,
    sameSite: "Strict",
  });
  return token;
};

export const generateToken = (user: any) => {
  let token = jwt.sign(
    {
      id: user?._id,
    },
    process.env.SECRET_KEY as string
  );
  return token;
};