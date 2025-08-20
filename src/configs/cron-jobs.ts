import cron from "node-cron";
import LockService from "../features/lock/lock.model";

namespace crons {
  export const initializeCronJobs = () => {

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily earned points update...");
  await LockService.updateDailyEarnedPoints(1000); // 2:1 ratio
});
  };

  export const sampleCronJob = () => {
    console.log("Cron job executed");
  };
}



export default crons;
