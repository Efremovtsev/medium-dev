// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// import { sanityClient } from '../../sanity';

const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
};

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
const client = require('@sanity/client')(config);

// const client = sanityClient(config);

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { _id, name, email, comment } = JSON.parse(request.body);

    try {
        await client.create({
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id,
            },
            name,
            email,
            comment,
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            message: 'Couldn"t submit comment',
            e: error,
        });
    }
    response.status(200).json({ message: 'Comment submitted' });
}
