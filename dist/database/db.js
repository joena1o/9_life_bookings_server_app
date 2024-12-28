"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectToDb;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection_string = process.env.URL || "";
async function connectToDb() {
    await mongoose_1.default.connect(connection_string).then((res) => {
        console.log("Connection was successful");
    }).catch((err) => {
        console.log(`Failed to connect due to ${err}`);
    });
}
//8UPiQf9smIzivgOA
