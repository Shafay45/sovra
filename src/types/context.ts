// import { Context, Scenes } from "telegraf";

// // Define the structure for session data in scenes
// interface MySceneSession extends Scenes.WizardSessionData {
//   address?: string;
//   amount?: string;
//   // Add any other session data you might need
// }

// // Define the structure for your bot's context
// export interface MyContext extends Context {
//   // Add scene management to the context
//   scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
//   wizard: Scenes.WizardContextWizard<MyContext>;

//   // Add session to the context
//   session: {
//     // You can add any global session data here
//     __scenes: MySceneSession;
//   };

//   // If you're using custom properties on your context, add them here
//   // For example:
//   // myCustomProperty: string;
// }
