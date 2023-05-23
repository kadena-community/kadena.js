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

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
// export {};
