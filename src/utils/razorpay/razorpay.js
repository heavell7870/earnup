import razorpay from 'razorpay';
import configs from '../../configs/index.js';

const instance = new razorpay({
    key_id: configs.RAZORPAY_KEY_ID,
    key_secret: configs.RAZORPAY_KEY_SECRET
});

export default instance