export const getUser = async (db, email) => {
    const user = await db.User.findOne({ email });
    return user;
};

export const getFolders = async (db, id) => {
    const folders = await db.Folder.find({
        user: id,
    });
    return folders;
};

export const handleGraphQLError = (e) => ({
    code: e.extensions.response.status,
    success: false,
    message: e.extensions.response.body,
});

export const handleAuthError = () => ({
    code: 401,
    success: false,
    message: 'Unauthenticated',
});
