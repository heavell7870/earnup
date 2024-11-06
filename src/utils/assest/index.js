import cloudinary from 'cloudinary'
import env from '../env.js'
import fs from 'fs'
import logger from '../logger/index.js'

cloudinary.config({
    cloud_name: env.cloudinary_cloud_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret
})

const uploadToCloudinary = async (stream) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result)
            } else {
                reject(error)
            }
        })

        stream.pipe(uploadStream)
    })
}

export const UPLOAD_IMAGE = (path) => {
    const stream = fs.createReadStream(path.path)
    return uploadToCloudinary(stream)
}

export const UPLOAD_MULTIPLE_IMAGE = async (imagePaths) => {
    const uploadPromises = imagePaths.map((imagePath) => {
        const stream = fs.createReadStream(imagePath.path)
        return uploadToCloudinary(stream)
    })

    try {
        const results = await Promise.all(uploadPromises)
        logger.info('Images uploaded successfully')
        return results
    } catch (error) {
        logger.error('Error uploading images:', error)
    }
}

export const DELETE_IMAGE = async (cloudinary_id) => {
    try {
        const result = await cloudinary.v2.uploader.destroy(cloudinary_id)
        return {
            message: 'Success',
            result
        }
    } catch (error) {
        logger.error('Error deleting image:', error)
        throw error
    }
}

export const BULK_DELETE_IMAGES = async (cloudinary_ids) => {
    try {
        const deleteResults = await Promise.all(
            cloudinary_ids.map(async (cloudinary_id) => {
                const result = await cloudinary.v2.uploader.destroy(cloudinary_id.public_id)
                return {
                    cloudinary_id,
                    result
                }
            })
        )

        return {
            message: 'Bulk delete success',
            results: deleteResults
        }
    } catch (error) {
        logger.error('Error deleting images:', error)
        throw error
    }
}
