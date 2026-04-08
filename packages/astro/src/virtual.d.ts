declare module "virtual:starsandstripes/config" {
  const config: import("./config.js").StarsAndStripesConfig;
  export default config;
}

declare module "virtual:starsandstripes/context" {
  const context: { root: string; trailingSlash: string };
  export default context;
}
