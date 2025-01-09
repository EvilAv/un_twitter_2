// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        "frontend/public/": "/",
        "frontend/src/": "/dist",
    },
    plugins: [
        /* ... */
    ],
    packageOptions: {
        /* ... */
    },
    devOptions: {
        port: 8081,
    },
    buildOptions: {
        /* ... */
    },
    routes: [
        {
            match: "routes",
            src: ".*",
            dest: "/index.html",
        },
    ],
};
