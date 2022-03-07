import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import NoteSelection from '@components/notes/NoteSelection';
import AddButton from '@components/ui/AddButton';
import { serverSideAuthentication } from '@lib/auth';
import useMediaQuery from '@lib/hooks/useMediaQuery';
import { selectRedirect } from '@store/history/selectors';
import { clearRedirect } from '@store/history/reducer';

export const getServerSideProps = serverSideAuthentication();

const NotesPage: NextPage = () => {
    const dispatch = useDispatch();
    const successRedirect = useSelector(selectRedirect);
    const { isDesktop } = useMediaQuery();
    const router = useRouter();

    React.useEffect(() => {
        if (successRedirect) {
            router.push(successRedirect);
            dispatch(clearRedirect());
        }
    }, [successRedirect, dispatch]);

    return !isDesktop ? (
        <>
            <NoteSelection />
            <AddButton variant="mobile" resource="note" />
        </>
    ) : null;
};

export default NotesPage;
