const { default: mongoose } = require('mongoose');
// const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const NewsModel = require('../models/News.model');

module.exports.home = (req, res) => {
    return res.send('API is connected successfully! 🎉')
}

module.exports.updateCategories = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { heroimage, image_2, image_3 } = req.body;
        console.log("req.body", req.body);


        if (!heroimage, !image_2, !image_3) {
            return res.status(400).json({
                success: false,
                message: 'Image field is required',
            });
        }

        // Step 1: Find all categories
        const categories = await NewsModel.find().sort({ updatedAt: -1 }); // Sorting by updatedAt in descending order;

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No categories found',
            });
        }

        // Step 2: Map through all categories to update the necessary field
        const updatedCategories = categories.map(category => ({
            updateOne: {
                filter: { _id: category._id }, // Update by ID
                update: { heroimage, image_2, image_3 }, // Replace with the new image value
            },
        }));

        // Step 3: Use bulkWrite to perform all updates in a single call
        await NewsModel.bulkWrite(updatedCategories);

        return res.status(200).json({
            success: true,
            message: 'Categories updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
        });
    }
};
// Function to generate a random date within the current week
const getRandomDateThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6); // 6 days ago from today
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setHours(23, 59, 59, 999);

    const randomTime = startOfWeek.getTime() + Math.random() * (endOfWeek.getTime() - startOfWeek.getTime());
    return new Date(randomTime);
};


module.exports.updateNewsDate = async (req, res, next) => {
    try {
        // const { tagId } = req.body;

        // if (!tagId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'tagId is required',
        //     });
        // }

        const news = await NewsModel.find();

        if (!news.length) {
            return res.status(404).json({
                success: false,
                message: 'No news found for the provided tagId',
            });
        }

        // Prepare bulk update operations with random dates for each news item
        const bulkOperations = news.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: { newsDate: getRandomDateThisWeek() }, // Unique random date for each
            },
        }));

        await NewsModel.bulkWrite(bulkOperations);

        return res.status(200).json({
            success: true,
            message: 'News dates updated successfully',
        });
    } catch (error) {
        console.error('Error updating news dates:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating news dates',
        });
    }
};