export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGOOSE_URL: string;
      SECRET_KEY: string
    }
  }
}
