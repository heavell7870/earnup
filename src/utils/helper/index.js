import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../../configs/index.js';
import axios from 'axios';
import querystring from 'querystring';
import moment from "moment";

export class Helper {
    static generateInvoiceNumber() {
        let number = Math.round(Math.random() * 10000000)
        let year = new Date().getFullYear()
        if (new Date().getMonth() >= 3) {
            return `FST/${number}/${year}-${year + 1}`;
        } else {
            return `FST/${number}/${year - 1}-${year}`;
        }
    }

    static async generateEncryptedPassword(password) {
        return await bcrypt.hash(password, env.SALT_ROUND)
    }

    static async validateThePassword(enteredPassword, savedPassword) {
        return await bcrypt.compare(enteredPassword, savedPassword)
    };

    static async generateAccessToken(user) {
        return jwt.sign(
            {
                id: user._id,
                iat: Date.now() / 1000
            },
            configs.ACCESS_TOKEN_SECRET,
            { expiresIn: configs.ACCESS_TOKEN_EXPIRY }
        );
    };

    static async generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user._id,
                iat: Date.now() / 1000
            },
            configs.REFRESH_TOKEN_SECRET,
            { expiresIn: configs.REFRESH_TOKEN_EXPIRY }
        );
    };

    static async generateAccessAndRefreshTokens(user) {

        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        return { accessToken, refreshToken };

    };

    static async generateEmailVerificationToken(userId) {
        return jwt.sign({ id: userId }, configs.EMAIL_VERIFICATION_SECRET, { expiresIn: configs.VERIFICATION_TOKEN_TTL });
    }

    static async decodeAccessToken(accessToken) {
        return jwt.verify(accessToken, configs.ACCESS_TOKEN_SECRET);
    }

    static async decodeRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, configs.REFRESH_TOKEN_SECRET);
    }

    static async decodeEmailVerificationToken(verificationToken) {
        return jwt.verify(verificationToken, configs.EMAIL_VERIFICATION_SECRET)
    }

    static generateOTP() {
        // Generates a random 6-digit number between 100000 and 999999
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = moment().add(2, 'minutes'); // Set expiration to 2 minutes from now
        return { otp: otp.toString(), expiresAt };
    }

    static async sentOTPThroughSMS(otp, phone) {
        try {
            const data = {
                username: configs.SMS_USERNAME,
                apikey: configs.SMS_API_KEY,
                apirequest: "Text",
                sender: configs.SENDER_ID,
                route: "OTP",
                format: "JSON",
                message: `Dear customer, your OTP for logging into FarmerShop is ${otp}. It is valid for ${configs.OTP_EXP} minutes. Please do not share this OTP with anyone. Thank you for shopping with us!`,
                mobile: phone,
                TemplateID: configs.TEMPLATE_ID,
            };
            const requestUrl = `${configs.URI}?${querystring.stringify(data)}`;
            let response = await axios.get(requestUrl)
            console.log("sms sent successfull", response.data);
        } catch (error) {
            console.log(error)
        }
    }

    static calculateDeliveryCharges(km) {
        let deliveryCharge = 0;
        if (km <= 5) {
            deliveryCharge = km * 10; // 10 rupees per km for up to 5 km
        } else if (km > 5 && km <= 7) {
            deliveryCharge = (5 * 10) + ((km - 5) * 20); // 10 rupees for first 5 km, 20 rupees for the next 2 km
        } else if (km > 7 && km <= 8) {
            deliveryCharge = (5 * 10) + (2 * 20) + ((km - 7) * 30); // 10 rupees for first 5 km, 20 rupees for next 2 km, 30 rupees for next 1 km
        } else if (km > 8 && km <= 9.5) {
            deliveryCharge = (5 * 10) + (2 * 20) + (1 * 30) + ((km - 8) * 40); // Additional charges for the distance above 8 km
        } else {
            deliveryCharge = (5 * 10) + (2 * 20) + (1 * 30) + (1.5 * 40) + ((km - 9.5) * 40); // 40 rupees per km for distances above 9.5 km
        }
        return deliveryCharge;
    }
    
    static applySurcharge(isRaining, isMidnight) {
        let surcharge = 0;
        if (isRaining) {
            surcharge += 20; // Surcharge for rain
        }
        if (isMidnight) {
            surcharge += 50; // Surcharge for midnight delivery
        }
        return surcharge;
    }

}