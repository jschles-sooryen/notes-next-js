/**
 * @jest-environment node
 */

import { ApolloServer } from 'apollo-server-micro';
import typeDefs from '@lib/graphql/typeDefs';
import resolvers from '@lib/graphql/resolvers';
import * as DbHelpers from '@lib/graphql/helpers';
import { GET_FOLDERS_QUERY } from '@lib/graphql/queries';

const email = 'admin@email.com';

const successResponse = {
    code: 200,
    success: true,
};

const testGetFoldersSuccessResponse = {
    ...successResponse,
    message: `Successfully retrieved folders for ${email}`,
    folders: [
        {
            _id: '61ba5a19ffecda0337360f42',
            name: 'GraphQL Folder',
            notes: [],
            createdAt: null,
            updatedAt: null,
            user: '61ba5a19ffecda0337360f3f',
        },
    ],
};

const mockDbConnection = {
    connection: jest.fn(),
    Folder: jest.fn(),
    Note: {
        find: jest.fn(() => []),
    },
};

const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: {
        name: 'admin',
        email,
        image: 'https://lh3.googleusercontent.com/a/AATXAJzLlJXt90hZvSHUts5579HkWHGC5-o4xfGeaRk6=s96-c',
    },
};

const testServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ session: mockSession, db: mockDbConnection }),
});

describe('GraphQL Resolvers', () => {
    beforeAll(() => {
        jest.spyOn(DbHelpers, 'getUser').mockImplementation(async () => {
            return await Promise.resolve({
                _id: '61ba5a19ffecda0337360f3f',
                email,
                googleProvider: {
                    id: '102573925002563805581',
                    _id: '61ba5a19ffecda0337360f40',
                },
                folders: [],
                __v: 0,
            });
        });

        jest.spyOn(DbHelpers, 'getFolders').mockImplementation(async () => {
            return await Promise.resolve([
                {
                    _id: '61ba5a19ffecda0337360f42',
                    name: 'GraphQL Folder',
                    notes: [],
                    user: '61ba5a19ffecda0337360f3f',
                },
            ]);
        });
    });

    it('Executes getFoldersQuery without error', async () => {
        const result = await testServer.executeOperation(
            GET_FOLDERS_QUERY(email)
        );
        expect(result.data.getFolders).toEqual(testGetFoldersSuccessResponse);
    });

    it('Throws GraphQL error on getFoldersQuery error', async () => {
        jest.spyOn(DbHelpers, 'getFolders').mockImplementationOnce(() => {
            throw new Error();
        });
        const result = await testServer.executeOperation(
            GET_FOLDERS_QUERY(email)
        );
        expect(result.data).toBe(null);
        expect(result.errors.length).toBe(1);
    });

    it('Throws Unauthenticated error on getFoldersQuery when wrong email is provided', async () => {
        const result = await testServer.executeOperation(
            GET_FOLDERS_QUERY('wronguser@email.com')
        );
        expect(result.data.getFolders.code).toBe(401);
        expect(result.data.getFolders.success).toBeFalsy();
        expect(result.data.getFolders.message).toBe('Unauthenticated');
    });
});