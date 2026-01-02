const express = require("express");
const Form = require("../models/form");

const route = express.Router();
route.get('/', async (req, res) => {
    try {
        const { search, branch, gender, subjectCode, sort } = req.query;
        let query = {};

        // Search by Name or Roll Number (case-insensitive regex)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Filters - exact match
        if (branch) query.branch = branch;
        if (gender) query.gender = gender;
        if (subjectCode) query.subjectCode = subjectCode;

        // Sorting
        let sortOption = { createdAt: 1 }; // Default: Oldest first
        if (sort === 'name_asc') sortOption = { name: 1 };
        else if (sort === 'name_desc') sortOption = { name: -1 };
        else if (sort === 'roll_asc') sortOption = { rollNumber: 1 };
        else if (sort === 'roll_desc') sortOption = { rollNumber: -1 };
        else if (sort === 'branch') sortOption = { branch: 1 };
        else if (sort === 'subject') sortOption = { subjectCode: 1 };

        const details = await Form.find(query).sort(sortOption);

        // Pass current filters back to view for UI state
        return res.render('details.ejs', {
            details,
            query: req.query,
            totalCount: details.length,
            baseUrl: req.baseUrl
        });
    } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).send("Internal Server Error");
    }
});

route.get('/export', async (req, res) => {
    try {
        const { search, branch, gender, subjectCode, sort } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (branch) query.branch = branch;
        if (gender) query.gender = gender;
        if (subjectCode) query.subjectCode = subjectCode;

        let sortOption = { createdAt: 1 };
        if (sort === 'name_asc') sortOption = { name: 1 };
        else if (sort === 'roll_asc') sortOption = { rollNumber: 1 };
        else if (sort === 'branch') sortOption = { branch: 1 };
        else if (sort === 'subject') sortOption = { subjectCode: 1 };

        const details = await Form.find(query).sort(sortOption);

        // Convert to CSV
        const header = ['Name', 'Email', 'Roll Number', 'Mobile Number', 'Gender', 'Branch', 'Subject Code', 'Registered At'];
        const rows = details.map(student => [
            student.name,
            student.email,
            student.rollNumber,
            student.mobileNum,
            student.gender,
            student.branch,
            student.subjectCode,
            new Date(student.createdAt).toLocaleString('en-IN')
        ]);

        // Escape CSV fields
        const escapeCsv = (str) => {
            if (str == null) return '';
            const stringValue = String(str);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.map(escapeCsv).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.status(200).send(csvContent);

    } catch (error) {
        console.error("Error exporting details:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = route;