import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { selectIsLoading } from '@store/loading/selectors';
import { Note } from '../../interfaces';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { formatDate } from '@lib/helpers';
import useMediaQuery from '@lib/hooks/useMediaQuery';
import Breadcrumbs from '@components/layout/Breadcrumbs';
import LoadingIndicator from '@components/ui/LoadingIndicator';
import Skeleton from '@components/ui/Skeleton';
import Button from '@components/ui/Button';
import OptionButton from '@components/ui/OptionButton';
import DeleteConfirmationModal from '@components/ui/DeleteConfirmationModal';
import { deleteNoteInit, updateNoteInit } from '@store/notes/reducer';

const NoteEditor = dynamic(() => import('@components/form/NoteEditor'), {
    ssr: false,
    loading: () => <LoadingIndicator />,
});

const NoteDescription = dynamic(() => import('./NoteDescription'), {
    ssr: false,
    loading: () => <LoadingIndicator />,
});

interface Props {
    note: Note;
    folderId: string;
    noteId: string;
}

const NoteDetail: React.FC<Props> = ({ note, folderId, noteId }) => {
    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const isLoading = useSelector(selectIsLoading);
    const { isMobile } = useMediaQuery();

    const onUpdate = (data) => {
        const payload = { ...data, folderId, noteId };
        dispatch(updateNoteInit(payload));
    };

    const onDelete = () => {
        dispatch(deleteNoteInit({ folderId, noteId }));
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setIsUpdating(false);
    }, [note]);

    return (
        <>
            <Box
                sx={{
                    paddingX: 2,
                    backgroundColor: 'secondary.light',
                    height: isMobile ? '100vh' : '100%',
                    maxHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {isUpdating ? (
                    <NoteEditor
                        name={note.name}
                        description={note.description}
                        onSubmit={onUpdate}
                        onCancel={() => setIsUpdating(false)}
                        isUpdating
                    />
                ) : (
                    <>
                        {!isMobile && <Breadcrumbs />}
                        <Box
                            sx={{
                                marginTop: 3,
                                display: 'flex',
                                alignItems: 'start',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: 1,
                                        marginTop: 0,
                                        lineHeight: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <Skeleton width="250px">
                                        {note?.name}
                                    </Skeleton>
                                </Typography>
                                <Typography paragraph sx={{ marginBottom: 0 }}>
                                    <Skeleton width="250px">
                                        <Typography
                                            component="span"
                                            sx={{ color: 'primary.light' }}
                                        >
                                            Last updated:
                                        </Typography>{' '}
                                        {formatDate(note?.updatedAt)}
                                    </Skeleton>
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                marginTop: 1,
                            }}
                        >
                            <Button
                                color="bg.main"
                                sx={{ marginRight: 2, fontSize: '12px' }}
                                onClick={() => setIsUpdating(true)}
                                startIcon={<Edit />}
                                disabled={isLoading}
                            >
                                Update
                            </Button>
                            <OptionButton
                                variant="warning"
                                onClick={() => setOpen(true)}
                                sx={{ fontSize: '12px' }}
                                startIcon={<Delete />}
                                disabled={isLoading}
                            >
                                Delete
                            </OptionButton>
                        </Box>

                        <NoteDescription value={note?.description} />
                    </>
                )}
            </Box>

            <DeleteConfirmationModal
                open={open}
                type="Note"
                onClose={handleClose}
                name={note?.name}
                onConfirm={onDelete}
            />
        </>
    );
};

export default NoteDetail;
