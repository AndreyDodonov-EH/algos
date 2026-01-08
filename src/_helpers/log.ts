const DEBUG = process.env.DEBUG;
export const log = DEBUG ? console.log.bind(console) : () => {};
