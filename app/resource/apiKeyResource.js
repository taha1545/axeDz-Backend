const ApiKeyResource = (apiKey) => {
  return {
    id: apiKey.id,
    project_name: apiKey.project_name,
    key: apiKey.key,
    status: apiKey.status,
    user_id: apiKey.user_id,
    created_at: apiKey.created_at,
    updated_at: apiKey.updated_at,
  };
};

module.exports = ApiKeyResource;