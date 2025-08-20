import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import IUser from "../../types/user";
import UserService from "./user-model";
import { setUserCookie } from "../../utils/auth";

namespace UserController {
  export const signUp = async (ctx: Context) => {
    try {
      let user: Partial<IUser> = await ctx.req.json();
      console.log("user", user);
      const createdUser = await UserService.createOrGet(user.walletAddress!);

      if (createdUser) {
        const token = await setUserCookie(createdUser, ctx);
        return ctx.json({
          response: "success",
          data: createdUser,
          token,
        });
      }
    } catch (error: any) {
      throw new HTTPException(500, { message: error?.message ?? error });
    }
  };
  export const getTrendingTokens = async (ctx: Context) => {
    try {
      console.log("getTrendingTokens");
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-chain": "base",
          "X-API-KEY": "5efcaa9255b0458dbec42cbe3588ea01",
        },
      };

      const res = await fetch(
        "https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20&ui_amount_mode=scaled",
        options
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("data", data.data.tokens[0]);
      return ctx.json({
        response: "success",
         data,
      });
    } catch (error: any) {
      console.error("Error fetching trending tokens:", error);
       throw new HTTPException(500, { message: error?.message ?? error });
    }
  };
}

export default UserController;
