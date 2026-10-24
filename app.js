import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend build from 'dist' folder
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// ---------------------------------------------------------------------------
// Employee Mongoose Schema & Model Definition
// Compatible with both Dashboard (ID, Name, Email) and EmployeeForm (Name, Designation, Location, Salary)
// ---------------------------------------------------------------------------
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required.'],
      trim: true,
      minlength: [2, 'Employee name must be at least 2 characters.'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required.'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters.'],
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required.'],
      min: [1, 'Salary must be a positive number greater than 0.'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: function () {
        if (this.name) {
          const sanitized = this.name.toLowerCase().replace(/[^a-z0-9]/g, '.');
          return `${sanitized}@example.com`;
        }
        return '';
      },
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON serialization for frontend table compatibility
employeeSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function to validate employee input fields
const validateEmployeeInput = (data, isUpdate = false) => {
  const errors = [];
  const { name, designation, location, salary } = data;

  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Employee name is required and must be at least 2 characters.');
    }
  }

  if (!isUpdate || designation !== undefined) {
    if (!designation || typeof designation !== 'string' || designation.trim().length < 2) {
      errors.push('Designation is required and must be at least 2 characters.');
    }
  }

  if (!isUpdate || location !== undefined) {
    if (!location || typeof location !== 'string' || location.trim().length < 1) {
      errors.push('Location is required.');
    }
  }

  if (!isUpdate || salary !== undefined) {
    const numSalary = Number(salary);
    if (salary === undefined || salary === null || isNaN(numSalary) || numSalary <= 0) {
      errors.push('Salary is required and must be a positive number greater than 0.');
    }
  }

  return errors;
};

// ---------------------------------------------------------------------------
// Backend REST API Endpoints
// ---------------------------------------------------------------------------

// 1. GET /api/employees - Retrieve all employee records
app.get('/api/employees', async (_req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json(employees);
  } catch (error) {
    return next(error);
  }
});

// 2. GET /api/employees/:id - Retrieve a single employee by MongoDB ID
app.get('/api/employees/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.',
      });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return next(error);
  }
});

// 3. POST /api/employees - Add a new employee
app.post('/api/employees', async (req, res, next) => {
  try {
    const errors = validateEmployeeInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const { name, designation, location, salary, email } = req.body;

    const newEmployee = new Employee({
      name: name.trim(),
      designation: designation.trim(),
      location: location.trim(),
      salary: Number(salary),
      ...(email && { email: email.trim() }),
    });

    const savedEmployee = await newEmployee.save();
    return res.status(201).json(savedEmployee);
  } catch (error) {
    return next(error);
  }
});

// 4. PUT /api/employees/:id - Update an employee by ID
app.put('/api/employees/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.',
      });
    }

    const errors = validateEmployeeInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name.trim();
    if (req.body.designation !== undefined) updateData.designation = req.body.designation.trim();
    if (req.body.location !== undefined) updateData.location = req.body.location.trim();
    if (req.body.salary !== undefined) updateData.salary = Number(req.body.salary);
    if (req.body.email !== undefined) updateData.email = req.body.email.trim();

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    return next(error);
  }
});

// 5. DELETE /api/employees/:id - Delete an employee by ID
app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.',
      });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.',
      data: { id: deletedEmployee._id },
    });
  } catch (error) {
    return next(error);
  }
});

// ---------------------------------------------------------------------------
// Frontend SPA Route Fallback (Serves index.html for non-API GET requests)
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Requested API endpoint not found.' });
  }
  return next();
});

// ---------------------------------------------------------------------------
// Central Error Handling Middleware
// ---------------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error('[API Error]:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format or ID.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
  });
});

// ---------------------------------------------------------------------------
// MongoDB Atlas Connection & Server Startup
// ---------------------------------------------------------------------------
const startServer = async () => {
  if (!MONGODB_URI) {
    console.error('FATAL: MONGODB_URI environment variable is not defined.');
    console.error('Please configure your MongoDB Atlas connection string in the .env file.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas.');

    app.listen(PORT, () => {
      console.log(`Employee App Server running at: http://localhost:${PORT}`);
      console.log(`API endpoints accessible under: http://localhost:${PORT}/api/employees`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
