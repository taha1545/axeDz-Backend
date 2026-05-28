const db = require("@db/models");
const { NotFoundError } = require("@errors");
const  ContactResource  = require("@app/resource/contactResource");


const All = async (req, res) => {
    //
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || 'unread';
    //
    let where = { status };
    //
    const { count, rows } = await db.Contact.findAndCountAll({
        where,
        offset,
        limit,
        order: [['created_at', 'DESC']]
    });
    //
    return res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: rows.map(contact => ContactResource(contact)),
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    });
};


const Create = async (req, res) => {
    const { name, email, phone = null, subject, message, status = "unread" } = req.body;
    const contact = await db.Contact.create({
        name,
        email,
        phone,
        subject,
        message,
        status
    });
    //
    return res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: ContactResource(contact)
    });
};

const Update = async (req, res) => {
    const id = req.params.id;
    const contact = await db.Contact.findByPk(id);
    if (!contact) {
        throw new NotFoundError('Contact not found');
    }
    //
    contact.status = req.body.status;
    await contact.save();
    //
    return res.status(200).json({
        success: true,
        message: "Contact updated successfully",
        data: ContactResource(contact)
    });
};

const Delete = async (req, res) => {
    const id = req.params.id;
    const contact = await db.Contact.findByPk(id);
    //
    if (!contact) {
        throw new NotFoundError('Contact not found');
    }
    //
    await contact.destroy();
    //
    return res.status(200).json({
        success: true,
        message: "Contact deleted successfully"
    });
};

module.exports = {
    All,
    Create,
    Update,
    Delete
};