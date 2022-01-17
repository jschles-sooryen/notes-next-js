import { FC } from 'react';
import { signOut } from 'next-auth/react';
import { Box } from '@mui/system';
import EventNoteRounded from '@mui/icons-material/EventNoteRounded';
import AccountCircleRounded from '@mui/icons-material/AccountCircleRounded';
import CreateRounded from '@mui/icons-material/CreateRounded';
import FolderRounded from '@mui/icons-material/FolderRounded';
import HeaderButton from './HeaderButton';
import Card from '../ui/Card';
import Breadcrumbs from './Breadcrumbs';

type Props = {
    isLoggedIn: boolean;
};

const Header: FC<Props> = ({ isLoggedIn }) => {
    const handleSignOut = async () => {
        // TODO: reset folders and notes state
        await signOut();
    };

    const renderSignedInButtons = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <HeaderButton href="/folders" sx={{ marginRight: 2 }}>
                <FolderRounded sx={{ marginRight: 1 }} /> Home
            </HeaderButton>

            <HeaderButton onClick={() => {}} sx={{ marginRight: 2 }}>
                {/* TODO: Add Sub menu */}
                <CreateRounded sx={{ marginRight: 1 }} /> Create
            </HeaderButton>

            <HeaderButton onClick={handleSignOut}>
                <AccountCircleRounded sx={{ marginRight: 1 }} /> Sign Out
            </HeaderButton>
        </Box>
    );

    return (
        <Box
            sx={{
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 4,
                paddingRight: 4,
                color: 'secondary.main',
                bgcolor: 'transparent',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                component="nav"
            >
                <Box>
                    <Card>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <EventNoteRounded sx={{ marginRight: 1 }} /> Next
                            Notes
                        </Box>
                    </Card>
                </Box>

                {isLoggedIn ? renderSignedInButtons() : null}
            </Box>
            {isLoggedIn ? <Breadcrumbs /> : null}
        </Box>
    );
};

export default Header;
