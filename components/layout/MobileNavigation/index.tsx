import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import NavigationDrawer from './NavigationDrawer';
import MobileUserInfo from './MobileUserInfo';
import MobileBreadcrumbs from './MobileBreadcrumbs';
import DeleteConfirmationModal from '@components/ui/DeleteConfirmationModal';
import NoteSearchInput from '@components/notes/NoteSearchInput';
import MoreIcon from '@mui/icons-material/MoreHorizRounded';
import { DELETE_FOLDER_MUTATION } from '@lib/graphql/mutations';
import fetcher from '@lib/graphql/fetcher';
import { useFolders } from '@lib/graphql/hooks';
import useLoggedInUser from '@lib/hooks/useLoggedInUser';
import { useStoreActions } from '@store/hooks';

const MobileNavigation: React.FC = () => {
    const setAlert = useStoreActions((actions) => actions.setAlert);
    const router = useRouter();
    const { email, user } = useLoggedInUser();
    const { revalidate, selectedFolder } = useFolders();
    const [open, setOpen] = React.useState(false);
    const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] =
        React.useState(false);
    const showBreadcrumbs =
        !!router.query.noteId || router.pathname === '/create-note';
    const showSearch =
        !!router.query.folderId &&
        !router.query.noteId &&
        router.pathname !== '/create-note';

    /* istanbul ignore next */
    const onDeleteFolderConfirm = async () => {
        const id = router.query.folderId as string;
        const mutation = DELETE_FOLDER_MUTATION(id, email);
        const response = await fetcher(mutation);
        if (response?.deleteFolder?.success) {
            setIsDeleteFolderModalOpen(false);

            revalidate();

            setAlert({
                type: 'success',
                message: 'Folder Successfully Deleted!',
            });

            if (window.location.href.includes(id)) {
                router.push('/folders');
            }
        } else {
            setAlert({
                type: 'error',
                message: `Error deleting folder: ${response?.deleteFolder?.message}`,
            });
        }
    };

    /* istanbul ignore next */
    return (
        <>
            <AppBar
                elevation={0}
                position="sticky"
                sx={{
                    backgroundColor: 'secondary.light',
                    color: 'primary.main',
                    boxShadow: 'none',
                    position: 'relative',
                }}
                data-testid="mobile-nav-container"
            >
                <Toolbar sx={{ borderBottom: '2px solid #eee' }}>
                    {showBreadcrumbs ? (
                        <MobileBreadcrumbs />
                    ) : (
                        <MobileUserInfo user={user} />
                    )}

                    <Box sx={{ display: 'flex' }}>
                        {showSearch && <NoteSearchInput />}
                        <IconButton
                            color="primary"
                            disableRipple
                            onClick={() => setOpen(true)}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <NavigationDrawer
                open={open}
                onClose={() => setOpen(false)}
                onDeleteFolderClick={() => setIsDeleteFolderModalOpen(true)}
            />

            <DeleteConfirmationModal
                type="Folder"
                open={isDeleteFolderModalOpen}
                name={selectedFolder?.name}
                onConfirm={onDeleteFolderConfirm}
                onClose={() => setIsDeleteFolderModalOpen(false)}
            />
        </>
    );
};

export default MobileNavigation;
