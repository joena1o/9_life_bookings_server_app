"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController = __importStar(require("../controllers/product.controller"));
const orders_controller_1 = require("../controllers/orders.controller");
const express_1 = require("express");
const authenticate_token_1 = __importDefault(require("../middleware/authenticate_token"));
const router = (0, express_1.Router)();
router.post("/", authenticate_token_1.default, ProductController.addProduct);
router.get("/", authenticate_token_1.default, ProductController.getProducts);
router.get('/getBookings/:productId', authenticate_token_1.default, orders_controller_1.getBookingAvailability);
router.get("/search", authenticate_token_1.default, ProductController.searchAndFilterProducts);
router.get("/users", authenticate_token_1.default, ProductController.getUsersProducts);
router.get("/:id", authenticate_token_1.default, ProductController.getProduct);
router.patch("/", authenticate_token_1.default, ProductController.editProduct);
router.delete("/", authenticate_token_1.default, ProductController.deleteProduct);
exports.default = router;
