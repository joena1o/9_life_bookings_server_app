"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_config_1 = __importDefault(require("../utils/multer_config"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const router = (0, express_1.Router)();
router.post('/upload-image', multer_config_1.default.array('image'), image_controller_1.default);
exports.default = router;
