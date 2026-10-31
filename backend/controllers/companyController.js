import Company from '../models/Company.js';

// @desc    Get all hiring partner companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({}).sort({ salary: -1 }); // Highest paying first
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new company requirement (Admin feature)
// @route   POST /api/companies
// @access  Private/Admin
export const createCompany = async (req, res, next) => {
  const { name, minCGPA, maxBacklogs, requiredSkills, branches, salary } = req.body;

  if (!name || minCGPA === undefined || maxBacklogs === undefined || !salary) {
    res.status(400);
    return next(new Error('Please provide name, minCGPA, maxBacklogs, and salary package'));
  }

  try {
    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      res.status(400);
      return next(new Error('Company with this name already exists'));
    }

    const company = await Company.create({
      name,
      minCGPA,
      maxBacklogs,
      requiredSkills: requiredSkills || [],
      branches: branches || ['All'],
      salary,
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a company (Admin feature)
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      return next(new Error('Company not found'));
    }

    await company.deleteOne();
    res.json({ message: 'Company successfully removed' });
  } catch (error) {
    next(error);
  }
};
