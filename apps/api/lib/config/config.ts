export const simpleConfig = {
    ws: {
        interval: 13000,
        host: "localhost",
        port: 5000,
        namespace: "markets",
        path: "/ws",
        cors: {
            origin: "*"
        },
    },
    redis: {
        host: "localhost",
        port: "6379",
    }
}