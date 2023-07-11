declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_DEV: 'test' | 'development' | 'production';
    MAILCHIMP_API: string;
    MAILCHIMP_SERVER_PREFIX: string;
    NEXT_PUBLIC_TRACKING_ID: string;
    NEXT_PUBLIC_GA_CLIENT_EMAIL: string;
    NEXT_PUBLIC_GA_PRIVATE_KEY: string;
  }
}
