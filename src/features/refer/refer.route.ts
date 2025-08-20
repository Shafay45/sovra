import { Hono } from "hono";
import ReferralController from "./refer.controller";

export const referralRouter = new Hono();

referralRouter.post("/set-refer-by", ReferralController.setReferBy);
referralRouter.get("/referrals/:userId", ReferralController.getReferrals);
referralRouter.post(
  "/claim-referral-points",
  ReferralController.claimReferralPoints
);
