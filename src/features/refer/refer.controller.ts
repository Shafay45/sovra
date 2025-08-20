import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import ReferService from "./refer.model";

namespace ReferralController {
  export const setReferBy = async (ctx: Context) => {
    try {
      const { walletAddress, referCode } = await ctx.req.json();
      console.log("walletAddress", walletAddress, "referCode", referCode);
      if (!walletAddress || !referCode) {
        throw new HTTPException(400, {
          message: "walletAddress and referCode are required",
        });
      }

      const updatedUser = await ReferService.updateReferBy(
        walletAddress,
        referCode
      );
      return ctx.json({ success: true, data: updatedUser });
    } catch (error: any) {
      throw new HTTPException(500, {
        message: error.message || "Internal Server Error",
      });
    }
  };
  export const getReferrals = async (ctx: Context) => {
    try {
      const userId = ctx.req.param("userId");
      const referrals = await ReferService.getReferralsByUserId(userId);

      return ctx.json({
        success: true,
        data: referrals,
      });
    } catch (error: any) {
      throw new HTTPException(500, { message: error?.message ?? error });
    }
  };

  export const claimReferralPoints = async (ctx: Context) => {
    try {
      const { userId } = await ctx.req.json();
      const result = await ReferService.claimReferralPoints(userId);

      return ctx.json({
        response: "success",
        message: "Referral points claimed successfully",
        data: result,
      });
    } catch (error: any) {
      throw new HTTPException(500, {
        message: error.message || "Internal server error",
      });
    }
  };
}
export default ReferralController;
