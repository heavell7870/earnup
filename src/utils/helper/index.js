import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import configs from '../../configs/index.js'
import axios from 'axios'
import querystring from 'querystring'
import moment from 'moment'
import { storeModel } from '../../models/productModel.js'
import distance from 'google-distance-matrix'
import logger from '../logger/index.js';
import { Buffer } from 'buffer'

export class Helper {
    /**
     * Generates a unique invoice number based on the current year. If the current
     * month is April or later, the year is the current year and the next year. If
     * the current month is March or earlier, the year is the previous year and the
     * current year.
     *
     * @returns {string} The generated invoice number
     */
    static generateInvoiceNumber() {
        let number = Math.round(Math.random() * 10000000)
        let year = new Date().getFullYear()
        if (new Date().getMonth() >= 3) {
            return `FST/${number}/${year}-${year + 1}`
        } else {
            return `FST/${number}/${year - 1}-${year}`
        }
    }

    /**
     * Generates an encrypted password using bcrypt.
     */
    static async generateEncryptedPassword(password) {
        return await bcrypt.hash(password, configs.SALT_ROUND)
    }

    /**
     * Validates the given entered password against the saved password hash.
     * @param {string} enteredPassword The password entered by the user.
     * @param {string} savedPassword The saved password hash.
     * @returns {Promise<boolean>} The result of validating the password.
     */
    static async validateThePassword(enteredPassword, savedPassword) {
        return await bcrypt.compare(enteredPassword, savedPassword)
    }

    /**
     * Generates an access token using the given user object.
     * @param {User} user The user object to generate the access token for.
     * @returns {Promise<string>} The generated access token.
     */
    static async generateAccessToken(user) {
        return jwt.sign(
            {
                id: user._id,
                iat: Date.now() / 1000
            },
            configs.ACCESS_TOKEN_SECRET,
            { expiresIn: configs.ACCESS_TOKEN_EXPIRY }
        )
    }

    /**
     * Generates a refresh token using the given user object.
     * @param {User} user The user object to generate the refresh token for.
     * @returns {Promise<string>} The generated refresh token.
     */
    static async generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user._id,
                iat: Date.now() / 1000
            },
            configs.REFRESH_TOKEN_SECRET,
            { expiresIn: configs.REFRESH_TOKEN_EXPIRY }
        )
    }

    /**
     * Generates an access token and a refresh token using the given user object.
     * @param {User} user The user object to generate the tokens for.
     * @returns {Promise<{accessToken: string, refreshToken: string}>} The generated access token and refresh token.
     */
    static async generateAccessAndRefreshTokens(user) {
        const accessToken = await this.generateAccessToken(user)
        const refreshToken = await this.generateRefreshToken(user)

        return { accessToken, refreshToken }
    }

    /**
     * Generates an email verification token for the given user ID.
     * @param {string} userId The ID of the user for whom the token is generated.
     * @returns {string} The generated email verification token.
     */
    static async generateEmailVerificationToken(userId) {
        return jwt.sign({ id: userId }, configs.EMAIL_VERIFICATION_SECRET, { expiresIn: configs.VERIFICATION_TOKEN_TTL })
    }

    /**
     * Decodes the given access token and returns the decoded payload.
     * @param {string} accessToken The access token to decode.
     * @returns {Promise<Object>} The decoded payload.
     */
    static async decodeAccessToken(accessToken) {
        return jwt.verify(accessToken, configs.ACCESS_TOKEN_SECRET)
    }

    /**
     * Decodes the given refresh token and returns the decoded payload.
     * @param {string} refreshToken The refresh token to decode.
     * @returns {Promise<Object>} The decoded payload.
     */
    static async decodeRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, configs.REFRESH_TOKEN_SECRET)
    }

    /**
     * Decodes the given email verification token and returns the decoded payload.
     * @param {string} verificationToken The email verification token to decode.
     * @returns {Promise<Object>} The decoded payload.
     */
    static async decodeEmailVerificationToken(verificationToken) {
        return jwt.verify(verificationToken, configs.EMAIL_VERIFICATION_SECRET)
    }

    /**
     * Generates a random 6-digit number between 100000 and 999999
     * and sets an expiration time of 2 minutes from the current time.
     */
    static generateOTP() {
        // Generates a random 6-digit number between 100000 and 999999
        const otp = Math.floor(100000 + Math.random() * 900000)
        const expiresAt = moment().add(2, 'minutes') // Set expiration to 2 minutes from now
        return { otp: otp.toString(), expiresAt }
    }

    /**
     * Sends an OTP to the given phone number using the SMS service configured in the .env file.
     * @param {string} otp The OTP to be sent to the user.
     * @param {string} phone The phone number of the user to whom the OTP is to be sent.
     */
    static async sentOTPThroughSMS(otp, phone) {
        try {
            const data = {
                username: configs.SMS_USERNAME,
                apikey: configs.SMS_API_KEY,
                apirequest: 'Text',
                sender: configs.SENDER_ID,
                route: 'OTP',
                format: 'JSON',
                message: `Dear customer, your OTP for logging into FarmerShop is ${otp}. It is valid for ${configs.OTP_EXP} minutes. Please do not share this OTP with anyone. Thank you for shopping with us!`,
                mobile: phone,
                TemplateID: configs.TEMPLATE_ID
            }
            const requestUrl = `${configs.URI}?${querystring.stringify(data)}`
            let response = await axios.get(requestUrl)
            logger.info('SMS sent successfully',response)
        } catch (error) {
            logger.error(error)
        }
    }

    /**
     * Calculates the delivery charges based on the distance in kilometers.
     * The delivery charge calculation is as follows:
     * - Up to 5 km: 10 rupees per km
     * - Between 5 km and 7 km: 10 rupees for the first 5 km, 20 rupees for the next 2 km
     * - Between 7 km and 8 km: 10 rupees for the first 5 km, 20 rupees for the next 2 km, 30 rupees for the next 1 km
     * - Between 8 km and 9.5 km: 10 rupees for the first 5 km, 20 rupees for the next 2 km, 30 rupees for the next 1 km, additional charges for the distance above 8 km
     * - Above 9.5 km: 10 rupees for the first 5 km, 20 rupees for the next 2 km, 30 rupees for the next 1 km, 40 rupees per km for distances above 9.5 km
     */
    static calculateDeliveryCharges(km) {
        let deliveryCharge = 0
        if (km <= 5) {
            deliveryCharge = km * 10 // 10 rupees per km for up to 5 km
        } else if (km > 5 && km <= 7) {
            deliveryCharge = 5 * 10 + (km - 5) * 20 // 10 rupees for first 5 km, 20 rupees for the next 2 km
        } else if (km > 7 && km <= 8) {
            deliveryCharge = 5 * 10 + 2 * 20 + (km - 7) * 30 // 10 rupees for first 5 km, 20 rupees for next 2 km, 30 rupees for next 1 km
        } else if (km > 8 && km <= 9.5) {
            deliveryCharge = 5 * 10 + 2 * 20 + 1 * 30 + (km - 8) * 40 // Additional charges for the distance above 8 km
        } else {
            deliveryCharge = 5 * 10 + 2 * 20 + 1 * 30 + 1.5 * 40 + (km - 9.5) * 40 // 40 rupees per km for distances above 9.5 km
        }
        return deliveryCharge
    }

    /**
     * Calculates the surcharge amount based on the given conditions.
     * If it is raining, a surcharge of 20 rupees is added.
     * If it is midnight, a surcharge of 50 rupees is added.
     * @param {boolean} isRaining Whether it is raining or not.
     * @param {boolean} isMidnight Whether it is midnight or not.
     * @returns {number} The total surcharge amount.
     */
    static applySurcharge(isRaining, isMidnight) {
        let surcharge = 0
        if (isRaining) {
            surcharge += 20 // Surcharge for rain
        }
        if (isMidnight) {
            surcharge += 50 // Surcharge for midnight delivery
        }
        return surcharge
    }

    /**
     * Finds stores near the user's location using geospatial queries.
     *
     * This function aggregates store data based on proximity to the user's
     * latitude and longitude. It uses a $geoNear pipeline stage to calculate
     * distances between the user's location and stores, converting distances
     * from meters to kilometers.
     *
     * @param {number} userLat - The latitude of the user's location.
     * @param {number} userLon - The longitude of the user's location.
     * @returns {Promise<Array>} A promise that resolves to an array of stores
     * with their respective distances from the user's location.
     * @throws {Error} If there is an error during the aggregation process.
     */
    static async findStoresNearUser(userLat, userLon) {
        try {
            const userLocation = {
                type: 'Point',
                coordinates: [userLon, userLat] // [longitude, latitude]
            }
            const stores = await storeModel.aggregate([
                {
                    $geoNear: {
                        near: userLocation,
                        distanceField: 'distance',
                        maxDistance: 10000,
                        spherical: true,
                        distanceMultiplier: 0.001 // Convert meters to kilometers
                    }
                },
                {
                    $match: { distance: { $lte: 10 } } // Only show stores within 10 km
                }
                // {
                //     $project: {
                //         name: 1,
                //         address: 1,
                //         distance: 1 // Distance in kilometers
                //     }
                // }
            ])

            return stores
        } catch (error) {
            logger.error('Error finding stores:', error)
            throw error
        }
    }
    /**
     * Calculates the distance between two points using the Google Distance Matrix API.
     *
     * Given two sets of coordinates, this function will calculate the distance and
     * duration between them. It wraps the distance.matrix function from the
     * google-distance-matrix library in a Promise, and returns the distance and
     * duration in a single object.
     *
     * @param {string[]} origins - A set of coordinates in the format 'latitude,longitude'
     * @param {string[]} destinations - A set of coordinates in the format 'latitude,longitude'
     * @returns {Promise<Object>} A promise that resolves to an object containing the
     * distance and duration between the two points. If there is an error, it will
     * reject the promise with the error.
     * @throws {Error} If there is an error during the calculation process.
     */
    static async calculateDistance(origins, destinations) {
        try {
            // var destinations = [...destinations];
            // var origins = [...origins];

            distance.key(configs.GOGLE_DISTNACE_API_KEY)
            distance.units('metric')
            distance.mode('driving')

            // Wrapping the distance.matrix in a Promise
            const getDistanceMatrix = () => {
                return new Promise((resolve, reject) => {
                    distance.matrix(origins, destinations, function (err, distances) {
                        if (err) {
                            return reject(err) // Reject the promise if there's an error
                        }
                        if (!distances) {
                            return reject('No distances found')
                        }
                        resolve(distances) // Resolve the promise with the distances data
                    })
                })
            }

            // Await the result from the promise
            let distances = await getDistanceMatrix()

            if (distances.status === 'OK' && distances.rows[0].elements[0].status === 'OK') {
                let distanceDetails = {
                    origin_addresses: distances.origin_addresses[0],
                    destination_addresses: distances.destination_addresses[0],
                    distance: distances.rows[0].elements[0].distance.text,
                    duration: distances.rows[0].elements[0].duration.text
                }
                return distanceDetails
            } else {
                logger.log(`${distances.destination_addresses[0]} is not reachable by land from ${distances.origin_addresses[0]}`)
            }
        } catch (error) {
            logger.error('Error:', error) // Catch any errors and print them
        }
    }
    /**
     * Encodes the given object to a Base64 string.
     * @param {object} data The object to encode.
     * @returns {string} The Base64 encoded string.
     */
    static encodeData(data) {
        const jsonStr = JSON.stringify(data) // Convert object to JSON string
        return Buffer.from(jsonStr).toString('base64') // Encode JSON string to Base64
    }
    static decodeData(encodedData) {
        const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8') // Decode Base64 to JSON string
        return JSON.parse(decodedStr) // Parse the JSON string back into an object
    }
}
