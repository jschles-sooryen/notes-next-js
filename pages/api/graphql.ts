import { ApolloServer } from 'apollo-server-micro';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import typeDefs from '@lib/graphql/typeDefs';
import connectToDatabase from '@lib/server/connectToDatabase';
import sanitize from '@lib/server/sanitize';

const getUser = async (db, email) => {
    const user = await db.User.findOne({ email });
    return user;
};

const handleGraphQLError = (e) => ({
    code: e.extensions.response.status,
    success: false,
    message: e.extensions.response.body,
});

const handleAuthError = () => ({
    code: 401,
    success: false,
    message: 'Unauthenticated',
});

const resolvers = {
    Query: {
        getFolders: async (_, args, { session, db }) => {
            let response;

            if (session.user.email === args.email) {
                const user = await getUser(db, args.email);

                try {
                    const folders = await await db.Folder.find({
                        user: user._id,
                    });

                    response = {
                        code: 200,
                        success: true,
                        message: `Successfully retrieved folders for ${args.email}`,
                        folders,
                    };
                } catch (e) {
                    response = {
                        ...handleGraphQLError(e),
                        folders: [],
                    };
                }
            } else {
                response = {
                    ...handleAuthError(),
                    folders: [],
                };
            }

            return response;
        },
    },
    Mutation: {
        createFolder: async (_, args, { session, db }) => {
            let response;

            if (session.user.email === args.email) {
                const user = await getUser(db, session.user.email);

                try {
                    const result = await new db.Folder({
                        name: args.name,
                        user: user._id,
                    });
                    await result.save();
                    response = {
                        code: 200,
                        success: true,
                        message: 'Successfully created new folder',
                        folder: result,
                    };
                } catch (e) {
                    response = {
                        ...handleGraphQLError(e),
                        folder: null,
                    };
                }
            } else {
                response = {
                    ...handleAuthError(),
                    folder: null,
                };
            }

            return response;
        },
        updateFolder: async (_, args, { session, db }) => {
            const { id, name, email } = args;
            let response;

            if (session.user.email === email) {
                const user = await getUser(db, session.user.email);
                const data = { name };

                try {
                    const result = await db.Folder.findOneAndUpdate(
                        { _id: id, user: user._id },
                        data,
                        { new: true }
                    );
                    response = {
                        code: 200,
                        success: true,
                        message: 'Successfully updated folder',
                        folder: result,
                    };
                } catch (e) {
                    response = {
                        ...handleGraphQLError(e),
                        folder: null,
                    };
                }
            } else {
                response = {
                    ...handleAuthError(),
                    folder: null,
                };
            }

            return response;
        },
        deleteFolder: async (_, args, { session, db }) => {
            const { id, email } = args;
            let response;

            if (session.user.email === email) {
                const user = await getUser(db, session.user.email);

                try {
                    const result = await db.Folder.findOneAndDelete(
                        {
                            _id: id,
                            user: user._id,
                        },
                        { rawResult: true }
                    );

                    if (result.ok) {
                        response = {
                            code: 200,
                            success: true,
                            message: 'Successfully deleted folder',
                        };
                    } else {
                        response = {
                            code: 500,
                            success: false,
                            message: 'Sorry, something went wrong',
                        };
                    }
                } catch (e) {
                    response = handleGraphQLError(e);
                }
            } else {
                response = handleAuthError();
            }

            return response;
        },
        createNote: async (_, args, { session, db }) => {
            const { folderId, name, description, email } = args;
            let response;

            if (session.user.email === email) {
                const user = await getUser(db, session.user.email);
                const parentFolder = await db.Folder.findById(folderId);

                if (
                    !!parentFolder &&
                    parentFolder.user.toString() === user._id.toString()
                ) {
                    const data = {
                        name,
                        description: sanitize(description),
                        folder: folderId,
                    };

                    try {
                        const result = await new db.Note(data);
                        await result.save();

                        response = {
                            code: 200,
                            success: true,
                            message: 'Successfully created note',
                            note: result,
                        };
                    } catch (e) {
                        response = handleGraphQLError(e);
                    }
                } else {
                    response = handleAuthError();
                }
            } else {
                response = handleAuthError();
            }

            return response;
        },
        updateNote: async (_, args, { session, db }) => {
            const { noteId, folderId, name, description, email } = args;
            let response;

            if (session.user.email === email) {
                const user = await getUser(db, session.user.email);
                const parentFolder = await db.Folder.findById(folderId);

                if (
                    !!parentFolder &&
                    parentFolder.user.toString() === user._id.toString()
                ) {
                    const data = {
                        name,
                        description: sanitize(description),
                    };

                    try {
                        const note = await db.Note.findOneAndUpdate(
                            { folder: folderId, _id: noteId },
                            data,
                            {
                                new: true,
                            }
                        ).clone();

                        response = {
                            code: 200,
                            success: true,
                            message: 'Successfully updated note',
                            note,
                        };
                    } catch (e) {
                        response = handleGraphQLError(e);
                    }
                } else {
                    response = handleAuthError();
                }
            } else {
                response = handleAuthError();
            }

            return response;
        },
        deleteNote: async (_, args, { session, db }) => {
            const { noteId, folderId, email } = args;
            let response;

            if (session.user.email === email) {
                const user = await getUser(db, session.user.email);
                const parentFolder = await db.Folder.findById(folderId);

                if (
                    !!parentFolder &&
                    parentFolder.user.toString() === user._id.toString()
                ) {
                    try {
                        const result = await db.Note.findByIdAndDelete(noteId);

                        response = {
                            code: 200,
                            success: true,
                            message: 'Successfully deleted note',
                        };
                    } catch (e) {
                        response = handleGraphQLError(e);
                    }
                } else {
                    response = handleAuthError();
                }
            } else {
                response = handleAuthError();
            }

            return response;
        },
    },
    Folder: {
        notes: async (obj, _, { db }) => {
            const notes = await db.Note.find({ folder: obj._id });
            return notes;
        },
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });

    if (session) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Access-Control-Allow-Origin',
            'https://studio.apollographql.com'
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );

        if (req.method === 'OPTIONS') {
            res.end();
            return false;
        }

        const db = await connectToDatabase();

        const apolloServer = await new ApolloServer({
            typeDefs,
            resolvers,
            context: () => ({ session, db }),
        });

        await apolloServer.start();
        await apolloServer.createHandler({
            path: '/api/graphql',
        })(req, res);

        await db.connection.close();
    } else {
        res.status(401).json({ message: 'Unauthenticated' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
