import amqp from 'amqplib';
import orderModel from '../../models/orderModel.js';
import cartModel from '../../models/cartModel.js';
import { errorHandler } from '../hanlders/errorHandler.js';
import logger from '../logger/index.js';
import { Buffer } from 'buffer';

let connection, channel;

async function connectRabbitMQ() {
    if (connection && channel) return { connection, channel };
    try {
        connection = await amqp.connect('amqp://localhost:5672'); // Replace with your RabbitMQ server URL
        channel = await connection.createChannel();
        logger.info('Connected to RabbitMQ');
        return { connection, channel };
    } catch (error) {
        errorHandler.handleRabbitMqError(error);
    }
}

async function publishMessage(queueName, message, delay = 0) {
    try {
        await connectRabbitMQ();
        await channel.assertQueue(queueName, { durable: true });
        const options = { persistent: true };
        if (delay > 0) options.headers = { 'x-delay': delay };
        channel.sendToQueue(queueName, Buffer.from(message), options);
        logger.info(`Published message to ${queueName} with delay of ${delay}ms`);
    } catch (error) {
        logger.error(`Failed to publish message to ${queueName}:`, error);
    }
}

async function consumeMessage(queueName, onMessage) {
    try {
        await connectRabbitMQ();
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, onMessage, { noAck: false });
        logger.info(`Consuming messages from ${queueName}...`);
    } catch (error) {
        logger.error(`Failed to consume messages from ${queueName}:`, error);
    }
}

async function consumeOrderMessage() {
    await consumeMessage('orderProcessingQueue', async (msg) => {
        try {
            const orderData = JSON.parse(msg.content.toString());
            await Promise.all(orderData.products.map(async (product) => {
                const order = await orderModel.create({
                    userId: orderData.userId,
                    storeId: orderData.storeId,
                    paymentId: orderData._id,
                    products: product,
                    deliveryAddress: orderData.deliveryAddress,
                    paymentDetails: orderData.paymentDetails,
                    isCod: orderData.paymentMode === 'cod',
                    orderProgressList: [{ status: 'Order Placed', time: new Date() }]
                });
                await publishMessage('orderApprovalQueue', JSON.stringify(order), 60000); // 1-minute delay
            }));
            await cartModel.deleteMany({ userId: orderData.userId });
            channel.ack(msg);
        } catch (error) {
            logger.error('Order processing failed:', error);
            channel.nack(msg, false, true); // Requeue the message
        }
    });
}

async function startApproveOrder() {
    await consumeMessage('orderApprovalQueue', async (msg) => {
        try {
            const approvalData = JSON.parse(msg.content.toString());
            const order = await orderModel.findById(approvalData._id);
            if (!order || order.isCancelled || order.isDelivered) {
                logger.info(`Order ${approvalData._id} was cancelled or already delivered`);
                channel.ack(msg);
                return;
            }
            
            order.isApproved = true;
            order.orderProgressList.push({ status: 'Order Approved', time: new Date() });
            await order.save();
            logger.info(`Order ${approvalData._id} approved`);
            channel.ack(msg);
        } catch (error) {
            logger.error('Order approval failed:', error);
            channel.nack(msg, false, true); // Requeue the message
        }
    });
}

export {
    connectRabbitMQ,
    publishMessage,
    consumeOrderMessage,
    startApproveOrder
};
