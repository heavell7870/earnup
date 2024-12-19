"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = __importDefault(require("../../configs"));
const logger_1 = __importDefault(require("../logger"));
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
        if (!DatabaseConnection.instance) {
            this.connect = this.connect.bind(this);
            this.disconnect = this.disconnect.bind(this);
            DatabaseConnection.instance = this;
        }
    }
    async connect() {
        if (this.isConnected) {
            logger_1.default.info('Already connected to MongoDB');
            return;
        }
        mongoose_1.default.connection.once('open', () => {
            logger_1.default.info('MongoDB connection is open');
            this.isConnected = true;
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.default.info('MongoDB connection error', error);
            this.isConnected = false;
        });
        try {
            const connection = await mongoose_1.default.connect(`${configs_1.default.MONGO_CONN_STR}`, {
                autoIndex: true,
                autoCreate: true
            });
            logger_1.default.info('Connecting to MongoDB...');
            return connection;
        }
        catch (error) {
            console.error('Failed to connect to MongoDB', error);
            this.isConnected = false;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            logger_1.default.info('Not connected to MongoDB');
            return;
        }
        logger_1.default.info('Disconnecting from MongoDB...');
        await mongoose_1.default.disconnect();
        this.isConnected = false;
        logger_1.default.info('Disconnected from MongoDB');
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
}
DatabaseConnection.instance = null;
const varOcg = DatabaseConnection.getInstance();
exports.connect = varOcg.connect;
exports.disconnect = varOcg.disconnect;
//# sourceMappingURL=index.js.map