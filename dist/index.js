"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./database/db"));
const image_route_1 = __importDefault(require("./routes/image.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const rating_route_1 = __importDefault(require("./routes/rating.route"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.use("/image", image_route_1.default);
app.use("/user", user_route_1.default);
app.use("/product", product_routes_1.default);
app.use("/rating", rating_route_1.default);
// Sample route
app.get('/', (req, res) => {
    res.send('Hello, Node.js with TypeScript!');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
