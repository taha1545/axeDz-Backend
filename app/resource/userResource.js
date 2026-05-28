const UserResource = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role : user.role,
    imagePath: user.imagePath,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
};

module.exports = UserResource;