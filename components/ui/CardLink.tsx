import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/router';
import Card from './Card';
import Link from './Link';

interface Props {
    children?: React.ReactNode;
    href?: string;
    sx?: SxProps<Theme>;
    cardSx?: SxProps<Theme>;
}

const CardLink: React.FC<Props> = ({ children, href, sx, cardSx }) => {
    const router = useRouter();

    const isActive = router.pathname === href;

    /* istanbul ignore next */
    return (
        <Link
            href={href}
            sx={[
                {
                    textDecoration: 'none',
                },
                // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <Card
                isButton
                isActive={isActive}
                sx={Array.isArray(cardSx) ? cardSx : [cardSx]}
            >
                {children}
            </Card>
        </Link>
    );
};

export default CardLink;
