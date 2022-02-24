import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import UserIcon from '@mui/icons-material/AccountCircleRounded';
import FolderIcon from '@mui/icons-material/FolderRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from '@components/ui/Link';
import AddButton from '@components/ui/AddButton';
import { resetFolders, setUpdating } from '@store/folders/reducer';
import { selectSelectedFolder } from '@store/folders/selectors';
import { resetNotes } from '@store/notes/reducer';

interface Props {
    open: boolean;
    onClose(): void;
    onDeleteFolderClick(): void;
}

const NavigationDrawer: React.FC<Props> = ({
    open,
    onClose,
    onDeleteFolderClick,
}) => {
    const dispatch = useDispatch();
    const selectedFolder = useSelector(selectSelectedFolder);
    const router = useRouter();
    const folderId = router.query.folderId;
    const noteId = router.query.noteId;

    const showFolderOptions = folderId && !noteId;
    const showNoteOptions = folderId && noteId;

    const handleSignOut = async () => {
        dispatch(resetFolders());
        dispatch(resetNotes());
        await signOut();
    };

    const handleUpdateFolderClick = () => {
        onClose();
        setTimeout(() => {
            dispatch(setUpdating(folderId));
        }, 0);
    };

    const handleDeleteFolderClick = () => {
        onDeleteFolderClick();
        onClose();
    };

    React.useEffect(() => {
        onClose();
    }, [router.pathname]);

    return (
        <Drawer open={open} anchor="right" onClose={onClose}>
            <Box>
                <List>
                    <Link href="/folders" passHref>
                        <ListItem button component="a">
                            <ListItemIcon>
                                <FolderIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Your Folders" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                    <Link href="/create-folder" passHref>
                        <AddButton variant="drawer" resource="folder" />
                    </Link>
                    {showFolderOptions && (
                        <>
                            <ListItem button onClick={handleUpdateFolderClick}>
                                <ListItemIcon>
                                    <EditIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Update Folder" />
                            </ListItem>
                            <ListItem button onClick={handleDeleteFolderClick}>
                                <ListItemIcon>
                                    <DeleteIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Delete Folder" />
                            </ListItem>
                        </>
                    )}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={handleSignOut}>
                        <ListItemIcon>
                            <UserIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default NavigationDrawer;
