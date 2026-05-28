const ContactResource = (contact) => {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    message: contact.message,
    status: contact.status,
    created_at: contact.created_at,
    updated_at: contact.updated_at,
  };
};

module.exports =  ContactResource ;